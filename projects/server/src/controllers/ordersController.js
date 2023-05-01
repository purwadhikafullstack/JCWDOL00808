// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const user_addresses = db.user_addresses;
const users = db.users;
const orders = db.orders;
const order_details = db.order_details;
const products = db.products;
const carts = db.carts;
const warehouses = db.warehouses;

const request = require("request");

module.exports = {
  addOrder: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      let { id } = req.dataDecode;
      let { total_price, status, shipping_method, shipping_cost, user_addresses_id, warehouses_id } = req.body;

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
      const postOrderDetails = await order_details.bulkCreate(orderDetailsData, {
        transaction: t,
      });

      //Delete cart data based on users_id
      const deleteCartData = await carts.destroy({ where: { users_id: id } }, { transaction: t });
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
    // const sort = req.query.sort || "createdAt";
    // const keyword = req.query.keyword || "";
    const users_id = req.dataDecode.id;
    try {
      let data = await orders.findAll({
        attributes: [[sequelize.fn("DATE_FORMAT", sequelize.col("orders.createdAt"), "%Y-%m-%d"), "when"], "status", "total_price", "id"],
        where: { users_id },
        include: {
          model: order_details,
          attributes: ["product_name", "quantity", "imageUrl"],
        },
      });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  cancelOrder: async (req, res) => {
    try {
      let users_id = req.dataDecode.id;

      let checkUser = await orders.findOne({ where: { id: req.body.id } });

      // check if user who wants to cancel order is the same user who is logging in
      if (users_id == checkUser.users_id) {
        let newStatus = "Canceled";
        await orders.update({ status: newStatus }, { where: { id: req.body.id } });

        res.status(200).send({
          success: true,
          message: "Order cancelled.",
          data: null,
        });
      } else if (users_id != checkUser.users_id) {
        res.status(500).send({
          success: false,
          message: "You don't own this transaction.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Cancel order failed.",
      });
    }
  },
  uploadPaymentProof: async (req, res) => {
    try {
      const users_id = req.dataDecode.id;

      let checkUser = await orders.findOne({ where: { id: req.body.id } });
      // check if user who wants to cancel order is the same user who is logging in
      if (users_id == checkUser.users_id) {
        let payment_proof = req.files?.payment_proof[0]?.path;

        await orders.update({ payment_proof }, { where: { id: req.body.id } });

        await orders.update({ status: "Waiting for confirmation" }, { where: { id: req.body.id } });

        res.status(200).send({
          success: true,
          message: "Proof of payment has been uploaded!",
        });
      } else if (users_id != checkUser.users_id) {
        res.status(500).send({
          success: false,
          message: "You don't own this transaction.",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong.",
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
      // const totalRows = await orders.count({
      //   ...(Object.keys(searchFilter).length > 0 && { where: searchFilter }),
      // });
      const totalRows = await orders.count({
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
            as: "user_address",
            attributes: ["recipient", "phone_number"],
          },
        ],
        subQuery: false,
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
      if (result.length === 0 && search !== "") {
        return res.status(404).json({ message: "No matching results found for the search query" });
      } else if (result.length === 0) {
        return res.status(404).json({ message: "Please assign warehouse first" });
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
            attributes: ["recipient", "phone_number", "address", "province", "city", "district", "postal_code"],
          },
        ],
      });

      //replace '\' with '/' for image
      if (result && result.payment_proof) {
        result.payment_proof = result.payment_proof.replace(/\\/g, "/");
      }

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

      //replace '\' with '/' for image
      result.forEach((image) => {
        image.imageUrl = image.imageUrl.replace(/\\/g, "/");
      });

      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },
};
