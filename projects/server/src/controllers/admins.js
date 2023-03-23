const db = require("../../models/index");
const AdminsModel = db.admins;
const UsersModel = db.users;
const WarehouseModel = db.warehouse;

const { sequelize } = require("../../models");
const { Op, where } = require("sequelize");

const { hashPassword } = require("./../lib/hash");
const { createToken } = require("./../lib/jwt");
const bcrypt = require("bcrypt");

module.exports = {
  getAdminsData: async (req, res) => {
    try {
      let data = await AdminsModel.findAll();
      return res.status(200).send(data);
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
  register: async (req, res) => {
    try {
      let { email, password, full_name, is_verified, phone_number, role } = req.body;
      let insertToAdmins = await AdminsModel.create({ email, password: await hashPassword, full_name, is_verified, phone_number, role });
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
      let data = await AdminsModel.findAll({
        where: {
          email,
        },
      });
      console.log("data dari admins:", data);

      if (data.length > 0) {
        let checkPass = bcrypt.compareSync(password, data[0].dataValues.password);
        if (checkPass) {
          let token = createToken({ ...data[0].dataValues });
          return res.status(200).send({
            success: true,
            message: "Admin login success!",
            data: {
              token: token,
              role: data[0].dataValues.role,
            },
          });
        } else {
          return res.status(200).send({
            success: false,
            message: "Password incorrect",
          });
        }
      } else {
        return res.status(200).send({
          success: false,
          message: "This account doesn't exists, please enter the correct e-mail.",
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
      let data = await AdminsModel.findAll({
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
  assignNewAdmin: async (req, res) => {
    // console.log("req.body assign admin: ", req.body);
    // let { id } = req.body;
    // let updateQuery = `UPDATE admins set role=2 where id=${db.escape(id)};`;

    // db.query(updateQuery, (err, result) => {
    //   if (err) {
    //     return res.status(500).send(
    //       {
    //         success: false,
    //         message: "Admin assign failed!"
    //       }
    //     );
    //   }
    //   if(!id){
    //     return res.status(200).send({
    //       success: false,
    //       message: "Admin not found!"
    //     })
    //   }
    //   return res.status(200).send({ success: true, message: "Assign admin success!" });
    // });

    // kalau pake sequelize:
    try {
      console.log("req.body: ", req.body);
      let data = await AdminsModel.findAll({ where: { id: req.body.id } });
      if (data.length > 0) {
        let update = await AdminsModel.update(
          {
            role: 2,
          },
          { where: { id: req.body.id } }
        );
        return res.status(200).send({
          success: true,
          message: "Admin has been assigned!",
        });
      } else {
        return res.status(200).send({
          success: false,
          message: "Admin not found!",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
};
