// Import Sequelize
const { sequelize } = require("../models");
const { Op } = require("sequelize");

// Import models
const db = require("../models/index");
const user_addresses = db.user_addresses;
const users = db.users;
const carts = db.carts;

module.exports = {
  getAddress: async (req, res) => {
    try {
      let { id } = req.dataDecode;
      const fetchAddress = await user_addresses.findAll({
        where: {
          users_id: id,
        },
      });
      res.status(200).send({
        isError: false,
        message: "Success fetch address",
        data: fetchAddress,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: error,
      });
    }
  },
  getCart: async (req, res) => {
    try {
      let { id } = req.dataDecode;
      const fetchCart = await carts.findAll({
        where: {
          users_id: id,
        },
      });
      res.status(200).send({
        isError: false,
        message: "Success fetch cart",
        data: fetchCart,
      });
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: error,
      });
    }
  },
  addOrder: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      let { id } = req.dataDecode;
      const {
        address_id,
        payment_method,
        shipping_method,
        shipping_cost,
        total_price,
        cart_id,
      } = req.body;
      const addOrder = await orders.create(
        {
          users_id: id,
          address_id: address_id,
          payment_method: payment_method,
          shipping_method: shipping_method,
          shipping_cost: shipping_cost,
          total_price: total_price,
          cart_id: cart_id,
          status: "Waiting for payment",
        },
        { transaction }
      );
      await transaction.commit();
      res.status(200).send({
        isError: false,
        message: "Success add order",
        data: addOrder,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).send({
        isError: true,
        message: "Internal server error",
        data: error,
      });
    }
  },
};
