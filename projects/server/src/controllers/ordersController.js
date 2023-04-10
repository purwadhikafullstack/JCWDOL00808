// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const user_addresses = db.user_addresses;
const users = db.users;
const orders = db.orders;
const carts = db.carts;

const request = require("request");

module.exports = {
  addOrder: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      let { id } = req.dataDecode;
      let { total_price, status, shipping_method, shipping_cost, user_addresses_id, warehouses_id } = req.body;
      //Delete cart data based on users_id
      const deleteCartData = await carts.destroy({ where: { users_id: id } }, { transaction: t });
      const createNewOrder = await orders.create(
        {
          total_price,
          status,
          shipping_method,
          shipping_cost,
          user_addresses_id,
          warehouses_id,
          users_id: id,
        },
        { transaction: t }
      );
      t.commit();

      res.status(201).send({
        isError: false,
        message: "Order created.",
        data: createNewOrder,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getOrderList: async (req, res) => {
    const users_id = req.dataDecode.id;
    try {
      let data = await orders.findAll({
        attributes: [[sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"), "when"]],
        where: { users_id },
      });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
};
