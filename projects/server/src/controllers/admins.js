
const db = require("../../models/index");
const admins = db.admins;

const { sequelize } = require("../../models");
const { where } = require("sequelize");

const { hashPassword } = require("./../lib/hash");
const { createToken } = require("./../lib/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  getData: async (req, res) => {
    try {
      let data = await admins.findAll();
      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
  register: async (req, res) => {
    try {
      let { email, password, full_name, is_verified, phone_number, role } = req.body;
      let insertToAdmins = await admins.create({ email, password: await hashPassword, full_name, is_verified, phone_number, role });
      console.log("insertToAdmins:", insertToAdmins);

    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Register failed",
      });
    }
  },
  login: async (req, res) => {
    console.log("data dari req.body: ", req.body);
    let { email, password } = req.body;
    try {
      let data = await admins.findAll({
        where: {
          email,
        },
      });
      console.log("data dari admins:", data);

      if (data.length > 0) {
        let checkPass = bcrypt.compareSync(password, data[0].dataValues.password);
        if (checkPass) {
          let token = createToken({ ...data[0].dataValues });
          return res.status(200).send({ ...data[0].dataValues, token });
        } else {
          return res.status(200).send({
            success: false,
            message: "Password incorrect",
          });
        }
      } else {
        return res.status(200).send({
          success: false,
          message: "This account doesn't exists",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
  keeplogin: async (req, res) => {
    console.log(req.decript);
    try {
      let data = await admins.findAll({
        where: {
          id: req.decript.id,
        },
      });
      console.log(data);

      let token = createToken({ ...data[0].dataValues });
      return res.status(200).send({ ...data[0].dataValues, token });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
};
