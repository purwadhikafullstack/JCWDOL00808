// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const users = db.users;

// Import verification token function
const {
  createVerificationToken,
  validateVerificationToken,
} = require("../helper/verificationToken");
// Import transporter function
const transporter = require("../helper/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const deleteFiles = require("./../helper/deleteFiles");
// Import hash function
const { hashPassword, hashMatch } = require("../lib/hash");
const { error } = require("console");

module.exports = {
  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const email = req.body.email;

      const findEmail = await users.findOne({ where: { email } });
      if (findEmail) {
        res.status(409).send({
          isError: true,
          message: "Email has been used.",
          data: null,
        });
      } else {
        const createAccount = await users.create({ email }, { transaction: t });

        const template = await fs.readFile(
          "./src/template/register.html",
          "utf-8"
        );
        let compiledTemplate = handlebars.compile(template);
        let registerTemplate = compiledTemplate({
          registrationLink: "http://localhost:3000/user/verify",
          email,
          token: createVerificationToken({ id: createAccount.dataValues.id }),
        });
        await transporter.sendMail({
          from: `Warehouser <${process.env.GMAIL}>`,
          to: email,
          subject: "Complete Your Registration",
          html: registerTemplate,
        });

        t.commit();
        res.status(201).send({
          isError: false,
          message: "Account created.",
          data: null,
        });
      }
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error,
        data: null,
      });
    }
  },
  verify: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { email, password, token } = req.body;
      validateVerificationToken(token);

      await users.update(
        { password: await hashPassword(password), is_verified: 1 },
        { where: { email } },
        { transaction: t }
      );

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Password created.",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error?.message,
        data: null,
      });
    }
  },
  isVerified: async (req, res) => {
    try {
      const { email } = req.params;

      const verificationStatus = await users.findOne({ where: { email } });

      res.status(200).send({
        isError: false,
        message: "Get verification status",
        data: verificationStatus.is_verified,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body;

      const findEmail = await users.findOne({ where: { email } });
      if (!findEmail) {
        res.status(409).send({
          isError: true,
          message: "Email not found.",
          data: null,
        });
      }

      let hasMatchResult = await hashMatch(
        password,
        findEmail.dataValues.password
      );

      if (hasMatchResult === false)
        return res.status(404).send({
          isError: true,
          message: "Password not valid",
          data: true,
        });

      res.status(200).send({
        isError: false,
        message: "Login Success",
        data: {
          token: createVerificationToken({ id: findEmail.dataValues.id }),
        },
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: true,
      });
    }
  },
  changePicture: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      //Get id from decoding token
      const { id } = req.dataDecode;
      const response = await users.findOne({ where: { id } });
      //Delete old profile_picture data
      const oldPicture = response.dataValues.profile_picture;
      if (oldPicture) {
        await fs.unlink(oldPicture, (err) => {
          if (err) throw err;
        });
      }
      //Get image path data from middleware
      let profile_picture = req.files?.profile_picture[0]?.path;

      await users.update(
        {
          profile_picture,
        },
        { where: { id } },
        { transaction: t }
      );

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Upload Success!",
        data: null,
      });
    } catch (error) {
      deleteFiles(req.files.profile_picture);
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  removePicture: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      //Get id from decoding token
      const { id } = req.dataDecode;
      const response = await users.findOne({ where: { id } });
      await users.update(
        { profile_picture: null },
        { where: { id } },
        { transaction: t }
      );
      await fs.unlink(response?.dataValues?.profile_picture, (err) => {
        if (err) throw err;
      });
      t.commit();
      res.status(200).send({
        isError: false,
        message: "Profile picture deleted.",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  editProfile: async (req, res) => {
    try {
      //Get id from decoding token
      const { id } = req.dataDecode;
      const { fullName, phoneNumber } = req.body;
      await users.update(
        { full_name: fullName, phone_number: phoneNumber },
        { where: { id } }
      );
      res.status(201).send({
        isError: false,
        message: "Profile updated.",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  editPassword: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      //Get id from decoding token
      const { id } = req.dataDecode;
      const { oldPassword, newPassword } = req.body;
      console.log(oldPassword, newPassword);
      //Get old password from database to compare
      const findOldPassword = await users.findOne({ where: { id } });
      //Compare input password with hashed password from database
      let hasMatchResult = await hashMatch(
        oldPassword,
        findOldPassword.dataValues.password
      );

      if (hasMatchResult === false)
        return res.status(401).send({
          isError: true,
          message: "Invalid password",
          data: true,
        });
      //Update new password after old password match
      await users.update(
        { password: await hashPassword(newPassword) },
        { where: { id } },
        { transaction: t }
      );
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Password updated.",
        data: null,
      });
    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
