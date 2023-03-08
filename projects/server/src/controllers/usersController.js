// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const users = db.users;

// Import verification token function
const { createVerificationToken } = require("../helper/verificationToken");
// Import transporter function
const transporter = require("../helper/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");

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
          message: "Email registered.",
          data: null,
        });
      }
    } catch (error) {
      t.rollback();
      console.log(error);
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
      const { email, password } = req.body;
      console.log(email);
      console.log(password);
      await users.update(password, { where: email }, { transaction: t });
    } catch (error) {
      console.log(error);
    }
  },
};
