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
const warehouses = db.warehouses;

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
  getOrders: async (req, res) => {
    try {
      let { id } = req.dataDecode;
      const role = req.query.role;

      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const offset = limit * page;
      const sort = req.query.sort || "id"; //default sorting by name
      const order = req.query.order || "DESC"; //default order DESC

      const adminFilter =
        role === "2"
          ? {
              "$warehouse.admins_id$": id,
            }
          : {};

      const searchFilter = search
        ? {
            [Op.or]: [
              {
                "$user_address.recipient$": {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                "$warehouse.name$": {
                  [Op.like]: "%" + search + "%",
                },
              },
              {
                "$orders.status$": {
                  [Op.like]: "%" + search + "%",
                },
              },
            ],
          }
        : {};
      const totalRows = await orders.count({
        ...(Object.keys(searchFilter).length > 0 && { where: searchFilter }),
      });

      const totalPage = Math.ceil(totalRows / limit);
      const result = await orders.findAll({
        where: {
          ...searchFilter,
          ...adminFilter,
        },
        include: [
          {
            model: warehouses,
            as: "warehouse",
            attributes: ["name", "admins_id"],
          },
          {
            model: user_addresses,
            as: "user_address", // Add 'as' property here
            attributes: ["recipient", "phone_number"],
          },
        ],
        offset: offset,
        limit: limit,
        order: Array.isArray(sort) ? [sort.concat(order)] : [[sort, order]],
        subQuery: false,
      });
      // replace '\' with '/'
      result.forEach((orderData) => {
        if (orderData.payment_proof) {
          orderData.payment_proof = orderData.payment_proof.replace(/\\/g, "/");
        }
      });
      console.log("Ini length" + result.length);
      if (result.length === 0) {
        return res
          .status(404)
          .json({ message: "Please assign warehouse first" });
      }
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
  getOrdersById: async (req, res) => {
    try {
      let { id } = req.params;
      const result = await orders.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: warehouses,
            as: "warehouse",
            attributes: ["name", "admins_id"],
          },
          {
            model: user_addresses,
            attributes: ["recipient", "phone_number"],
          },
        ],
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },
  getOrderDetails: async (req, res) => {
    try {
      let { id } = req.params;
      const result = await order_details.findAll({
        where: {
          orders_id: id,
        },
      });
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },
};
