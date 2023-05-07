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
const stocks = db.stocks;
const admins = db.admins;

const request = require("request");

module.exports = {
  addOrder: async (req, res) => {
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

      // Get all carts data owned by specific user and merged with products data
      const fetchCart = await carts.findAll({
        where: {
          users_id: id,
        },
        include: [
          {
            model: products,
            as: "product",
            required: true,
            attributes: [
              "id",
              "name",
              "price",
              "weight",
              "imageUrl",
              "booked_stock",
            ],
          },
        ],
        attributes: ["id", "users_id", "quantity", "products_id"],
      });

      // check if order qty less than stocks available
      let validationChecker = [];
      for (i = 0; i < fetchCart.length; i++) {
        let booked_stock = fetchCart[i].product.booked_stock;
        let id = fetchCart[i].products_id;
        let quantity = fetchCart[i].quantity;
        let product_stock = await stocks.findAll({
          where: {
            products_id: id,
          },
          raw: true,
        });
        let stock = 0;
        for (j = 0; j < product_stock.length; j++) {
          stock += product_stock[j].stock;
        }
        if (quantity <= stock) {
          validationChecker.push(i);
          booked_stock += quantity;
          let updateBookedStock = await products.update(
            { booked_stock },
            { where: { id } }
          );
        }
      }

      if (fetchCart.length == validationChecker.length) {
        const createNewOrder = await orders.create({
          total_price,
          status,
          shipping_method,
          shipping_cost,
          user_addresses_id,
          warehouses_id,
          users_id: id,
        });

        let findOrderId = await orders.findOne({
          where: { users_id: id },
          order: [["id", "DESC"]],
        });

        for (i = 0; i < fetchCart.length; i++) {
          let carts_id = fetchCart[i].id;

          //Post all carts data to order_details table
          let addOrderDetails = await order_details.create({
            orders_id: findOrderId.dataValues.id,
            products_id: fetchCart[i].product.id,
            product_name: fetchCart[i].product.name,
            quantity: fetchCart[i].quantity,
            product_price: fetchCart[i].product.price,
            product_weight: fetchCart[i].product.weight,
            imageUrl: fetchCart[i].product.imageUrl,
          });

          //Delete cart data based on users_id
          let deleteCartData = await carts.destroy({ where: { id: carts_id } });
        }
      }

      res.status(200).send({
        success: true,
        message: "Order added",
        data: fetchCart,
      });
    } catch (error) {
      console.log(error);
    }
  },
  getOrderList: async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = 5;
    const offset = limit * page;

    // const sort = req.query.sort || "id";
    const order = req.query.order || "DESC";
    // const keyword = req.query.keyword || "";
    const status = req.query.status || "";
    const users_id = req.dataDecode.id;
    try {
      // get data length
      let dataLength = await orders.findAll({
        where: {
          users_id,
          status: {
            [Op.like]: "%" + status + "%",
          },
        },
      });

      let data = await orders.findAll({
        include: {
          model: order_details,
        },
        required: true,
        limit,
        offset,
        order: [["id", order]],
        attributes: [
          [
            sequelize.fn(
              "DATE_FORMAT",
              sequelize.col("orders.createdAt"),
              "%Y-%m-%d"
            ),
            "when",
          ],
          "status",
          "total_price",
          "id",
          "shipping_method",
          "shipping_cost",
        ],
        where: {
          users_id,
          status: {
            [Op.like]: "%" + status + "%",
          },
        },
      });
      // console.log("length:", data.length);
      res.status(200).send({
        data,
        totalPage: Math.ceil(dataLength.length / limit),
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  getDetails: async (req, res) => {
    try {
      let data = await order_details.findAll({
        where: { orders_id: req.query.orders_id },
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong",
      });
    }
  },
  cancelOrder: async (req, res) => {
    try {
      let users_id = req.dataDecode.id;

      let checkUser = await orders.findOne({ where: { id: req.body.id } });

      // check if user who wants to cancel order is the same user who is logging in
      if (users_id == checkUser.users_id) {
        let orders_id = req.body.id;

        // find order details
        let findToCancel = await order_details.findAll({
          where: { orders_id },
          raw: true,
        });
        for (let i = 0; i < findToCancel.length; i++) {
          let products_id = findToCancel[i].products_id;

          let findProducts = await products.findOne({
            where: { id: products_id },
            raw: true,
          });

          let stockToReturn = parseInt(findToCancel[i].qty);
          let booked_stock =
            parseInt(findProducts.booked_stock) - stockToReturn;
          let updateBooked_stock = await products.update(
            { booked_stock },
            { where: { id: products_id } }
          );
        }

        let newStatus = "Canceled";
        let updateOrderStatus = await orders.update(
          { status: newStatus },
          { where: { id: orders_id } }
        );

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
  cancelUserOrder: async (req, res) => {
    try {
      // check if someone who wants to cancel order is the real admin who is logging in
      let orders_id = req.body.id;
      let admins_id = req.dataDecode.id;
      let checkAdmin = await admins.findOne({ where: { id: admins_id } });

      if (checkAdmin) {
        // find order details
        let findToCancel = await order_details.findAll({
          where: { orders_id },
          raw: true,
        });
        for (let i = 0; i < findToCancel.length; i++) {
          let products_id = findToCancel[i].products_id;

          let findProducts = await products.findOne({
            where: { id: products_id },
            raw: true,
          });

          let stockToReturn = parseInt(findToCancel[i].qty);
          let booked_stock =
            parseInt(findProducts.booked_stock) - stockToReturn;
          let updateBooked_stock = await products.update(
            { booked_stock },
            { where: { id: products_id } }
          );
        }
        let updateOrderStatus = await orders.update(
          { status: "Canceled" },
          { where: { id: orders_id } }
        );
      } else {
        res.status(500).send({
          success: false,
          message: "You don't own this transaction.",
        });
      }

      res.status(200).send({
        success: true,
        message: "Order cancelled.",
      });
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

        await orders.update(
          { status: "Waiting for confirmation" },
          { where: { id: req.body.id } }
        );

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
        return res
          .status(404)
          .json({ message: "No matching results found for the search query" });
      } else if (result.length === 0) {
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
            attributes: [
              "recipient",
              "phone_number",
              "address",
              "province",
              "city",
              "district",
              "postal_code",
            ],
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
