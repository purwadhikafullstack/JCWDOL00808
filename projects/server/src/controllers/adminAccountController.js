// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const admins = db.admins;
const usersList = db.users;

// import JOI untuk validasi input dari user
const Joi = require("joi");

//import hashing
const { hashPassword, hashMatch } = require("../lib/hash");

module.exports = {
  getUserAdmin: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const sort = req.query.sort || "id"; //default sorting by id
      const order = req.query.order || "DESC"; //default order DESC
      const totalRows = await admins.count({
        where: {
          [Op.or]: [
            {
              full_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await admins.findAll({
        where: {
          [Op.or]: [
            {
              full_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              phone_number: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [[sort, order]], // add order clause with the sort and order parameters
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },

  getUserList: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const totalRows = await usersList.count({
        where: {
          [Op.or]: [
            {
              full_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await usersList.findAll({
        where: {
          [Op.or]: [
            {
              full_name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              email: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              phone_number: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              is_verified: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [["id", "DESC"]],
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },

  register: async (req, res) => {
    const t = await sequelize.transaction();

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      full_name: Joi.string().required(),
      phone_number: Joi.string().required(),
      role: Joi.string().valid("1", "2").required(),
      // profile_picture: Joi.object().required(),
    });

    try {
      //step 1 ambil data dari client (body)
      // let { email, password, full_name, phone_number, role } = req.body;
      let profile_picture = req.files.profile_picture[0].path;

      // Validate input data against schema
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({
          isError: true,
          message: error.details[0].message,
          data: null,
        });
      }

      // step 2 validasi
      let findEmail = await admins.findOne({
        where: {
          email: value.email,
        },
      });

      if (findEmail)
        return res.status(400).send({
          isError: true,
          message: "email is exist",
          data: null,
        });

      //step 3 insert data ke users
      // await admins.create({ email, password: await hashPassword(password), full_name, phone_number, role, profile_picture }, { transaction: t });
      await admins.create({ ...value, password: await hashPassword(value.password), profile_picture }, { transaction: t });

      //step 5 kirim response
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "register success",
        data: null,
      });
    } catch (error) {
      await t.rollback();

      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  patchAdmin: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(8),
        full_name: Joi.string(),
        phone_number: Joi.string(),
        role: Joi.string(),
      });
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).send({
          isError: true,
          message: error.details[0].message,
          data: null,
        });
      }

      // step 1: retrieve admin data from database
      const { id } = req.params;
      let admin = await admins.findOne({ where: { id: id } });
      if (!admin) {
        await t.rollback();
        return res.status(404).send({
          isError: true,
          message: "Admin not found",
          data: null,
        });
      }

      // step 2: update admin data based on request body
      let { email, password, full_name, phone_number, role } = value;
      if (email) {
        let findEmail = await admins.findOne({
          where: {
            email,
            id: { [Op.ne]: admin.id }, // exclude current admin
          },
        });

        //check email to prevent the same email in db
        if (findEmail) {
          return res.status(400).send({
            isError: true,
            message: "Email already exists",
            data: null,
          });
        }
        admin.email = email;
      }
      if (password) {
        admin.password = await hashPassword(password);
      }
      if (full_name) {
        admin.full_name = full_name;
      }
      if (phone_number) {
        admin.phone_number = phone_number;
      }
      if (role) {
        admin.role = role;
      }
      if (req.files && req.files.profile_picture) {
        admin.profile_picture = req.files.profile_picture[0].path;
      }
      await admin.save({ transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Admin data updated successfully",
        data: null,
      });
    } catch (error) {
      await t.rollback();

      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  deleteAdmin: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // step 1: retrieve admin data from database
      const { id } = req.params;
      let admin = await admins.findOne({ where: { id: id } });
      if (!admin) {
        return res.status(404).send({
          isError: true,
          message: "Admin not found",
          data: null,
        });
      }

      // step 2: delete admin data from database
      await admins.destroy({ where: { id: id } }, { transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Admin data deleted successfully",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
