// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const user_addresses = db.user_addresses;
const users = db.users;
const orders = db.orders;
const carts = db.carts;
const products = db.products;
const order_details = db.order_details;

const request = require("request");

module.exports = {
  addOrder: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      let { id } = req.dataDecode;
      let {
        total_price,
        status,
        shipping_method,
        shipping_cost,
        user_addresses_id,
        warehouses_id,
      } = req.body;

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

      //Get all carts data owned by specific user and merged with products data
      const fetchCart = await carts.findAll({
        where: {
          users_id: id,
        },
        include: [
          {
            model: products,
            as: "product",
            required: true,
            attributes: ["id", "name", "price", "weight", "imageUrl"],
          },
        ],
        attributes: ["id", "users_id", "quantity"],
      });
      // console.log(JSON.stringify(fetchCart, null, 2));

      const orderDetailsData = fetchCart.map((cartItem) => ({
        orders_id: createNewOrder.id,
        products_id: cartItem.product.id,
        product_name: cartItem.product.name,
        quantity: cartItem.quantity,
        product_price: cartItem.product.price,
        product_weight: cartItem.product.weight,
        imageUrl: cartItem.product.imageUrl,
      }));

      //Post all carts data to order_details table
      const postOrderDetails = await order_details.bulkCreate(
        orderDetailsData,
        {
          transaction: t,
        }
      );

      //Delete cart data based on users_id
      const deleteCartData = await carts.destroy(
        { where: { users_id: id } },
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
};
