const db = require("../models/index");
const AdminsModel = db.admins;
const UsersModel = db.users;
const WarehousesModel = db.warehouses;
const OrdersModel = db.orders;

const { sequelize } = require("../models");
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
      let { email, password, full_name, is_verified, phone_number, role } =
        req.body;
      let insertToAdmins = await AdminsModel.create({
        email,
        password: await hashPassword,
        full_name,
        is_verified,
        phone_number,
        role,
      });
      // console.log("insertToAdmins:", insertToAdmins);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Register failed",
      });
    }
  },
  login: async (req, res) => {
    let { email, password } = req.body;
    try {
      let data = await AdminsModel.findAll({
        where: {
          email,
        },
      });

      if (data.length > 0) {
        let checkPass = bcrypt.compareSync(
          password,
          data[0].dataValues.password
        );
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
          message:
            "This account doesn't exists, please enter the correct e-mail.",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
  assignNewAdmin: async (req, res) => {
    try {
      let { id, admins_id } = req.body;

      let data = await AdminsModel.findAll({ where: { id: admins_id } });
      if (data.length > 0) {
        let update = await WarehousesModel.update(
          { admins_id },
          { where: { id } }
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
  dashboardData: async (req, res) => {
    try {
      let admins_id = req.dataDecode.id;
      let data = {};

      // total user
      let users = await UsersModel.findAndCountAll({});
      data.users = users.count;

      // total order
      let orders = await OrdersModel.findAndCountAll({
        where: {
          status: {
            [Op.not]: ["Canceled", "Waiting for payment"],
          },
        },
      });
      data.orders = orders.count;

      // total warehouse
      let warehouses = await WarehousesModel.findAndCountAll({});
      data.warehouses = warehouses.count;

      // total admin assigned
      let warehouseAdmin = await AdminsModel.findAndCountAll({
        where: { role: 2 },
      });
      data.warehouseAdmin = warehouseAdmin.count;

      return res.status(200).send({
        success: true,
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
