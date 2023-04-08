// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models");
const Order = db.orders;
const orderDetails = db.order_details;

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
};
