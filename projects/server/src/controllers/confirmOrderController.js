// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models");
const Order = db.orders;
const orderDetails = db.order_details;
const Product = db.products;
const Warehouse = db.warehouses;
const Stock = db.stocks;
const StockHistory = db.stock_histories;

module.exports = {
  // waiting_payment_confirmation: async (req, res) => {
  //   try {
  //     const pendingOrders = await Order.findAll({
  //       where: { status: "Waiting for Confirmation" },
  //       include: [
  //         {
  //           model: orderDetails,
  //           as: "order_details",
  //           foreignKey: "orders_id",
  //         },
  //       ],
  //     });
  //     res.json(pendingOrders);
  //   } catch (err) {
  //     console.error(err);
  //     res.status(500).json({ message: "Internal Server Error" });
  //   }
  // },

  waiting_payment_confirmation: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const sort = req.query.sort || "createdAt"; //default sorting by date
      const order = req.query.order || "DESC"; //default order DESC
      const statusFilter = req.query.status || "";
      const whereClause = {
        [Op.or]: [
          {
            total_price: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            status: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      };
      if (statusFilter !== "") {
        whereClause.status = statusFilter;
      }
      const totalRows = await Order.count({
        where: whereClause,
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await Order.findAll({
        where: whereClause,
        include: [
          {
            model: orderDetails,
            as: "order_details",
            foreignKey: "orders_id",
          },
        ],
        offset: offset,
        limit: limit,
        order: [[sort, order]], // add order clause with the sort and order parameters
      });

      //replace '\' with '/'
      // result.forEach((proof) => {
      //   proof.payment_proof = proof.payment_proof.replace(/\\/g, "/");
      // });

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

  acceptPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Update order status to "Processed"
      await order.update({ status: "On Process" });
      // Update product stock and generate stock transfer request if necessary
      const orderDetail = await orderDetails.findAll({
        where: { orders_id: order.id },
      });
      for (const detail of orderDetail) {
        // const product = await Product.findByPk(detail.products_id);
        const warehouse = await Warehouse.findByPk(order.warehouses_id);
        const stock = await Stock.findOne({
          where: {
            products_id: detail.products_id,
            warehouses_id: order.warehouses_id,
          },
        });
        if (stock.stock < detail.quantity) {
          // If there is a shortage of stock, generate a request to transfer stock from the nearest branch with sufficient stock.
          const nearestWarehouse = await Warehouse.findAll({
            attributes: ["id", [db.fn("ST_Distance_Sphere", db.literal(`POINT(${warehouse.longitude} ${warehouse.latitude})`), db.literal(`POINT(longitude latitude)`)), "distance"]],
            where: {
              id: {
                [Op.ne]: warehouse.id,
              },
            },
            include: [
              {
                model: Stock,
                where: {
                  products_id: detail.product_id,
                },
              },
            ],
            order: db.literal("distance ASC"),
            limit: 1,
          });
          if (nearestWarehouse.length === 0) {
            return res.status(400).json({ message: "Insufficient stock and no nearest warehouse with sufficient stock" });
          }
          // Generate stock transfer request here
          await StockMutation.create({
            from_warehouse_id: warehouse.id,
            to_warehouse_id: nearestWarehouse[0].id,
            quantity: detail.quantity,
            mutation_type: "TRANSFER",
            products_id: detail.products_id,
          });
          // const stockHistoryFrom = await StockHistory.create({
          await StockHistory.create({
            stock_before: stock.stock,
            stock_after: stock.stock - detail.quantity,
            products_id: detail.products_id,
            warehouses_id: warehouse.id,
          });
          // const stockHistoryTo = await StockHistory.create({
          await StockHistory.create({
            stock_before: nearestWarehouse[0].stocks[0].stock,
            stock_after: nearestWarehouse[0].stocks[0].stock + detail.quantity,
            products_id: detail.products_id,
            warehouses_id: nearestWarehouse[0].id,
          });
          await stock.update({ stock: 0 });
          await nearestWarehouse[0].stocks[0].update({ stock: nearestWarehouse[0].stocks[0].stock + detail.quantity });
        } else {
          await stock.update({ stock: stock.stock - detail.quantity });
          await StockHistory.create({
            stock_before: stock.stock + detail.quantity,
            stock_after: stock.stock,
            products_id: detail.products_id,
            warehouses_id: warehouse.id,
            description: "Send to buyer address",
          });
        }
      }
      res.json({ message: "Order accepted and processed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  rejectPayment: async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Update order status to "Waiting for Payment"
      await order.update({ status: "Waiting for Payment" });
      res.json({ message: 'Order rejected and status reverted to "Waiting for Payment"' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
