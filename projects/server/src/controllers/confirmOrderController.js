// Import Sequelize
const { sequelize } = require("../../models");
const { Op, fn } = require("sequelize");

// Import models
const db = require("../../models");
const Order = db.orders;
const orderDetails = db.order_details;
const Product = db.products;
const Warehouse = db.warehouses;
const Stock = db.stocks;
const StockHistory = db.stock_histories;
const StockMutation = db.stock_mutations;

//import utils function
const { haversineDistance } = require("../utils/function");

module.exports = {
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
    const t = await sequelize.transaction();
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      // Update order status to "Processed"
      await order.update({ status: "On process" }, { transaction: t });

      // Update product stock and generate stock transfer request if necessary
      const orderDetail = await orderDetails.findAll({
        where: { orders_id: order.id },
      });
      for (const detail of orderDetail) {
        const warehouse = await Warehouse.findByPk(order.warehouses_id);
        const stock = await Stock.findOne({
          where: {
            products_id: detail.products_id,
            warehouses_id: order.warehouses_id,
          },
        });
        if (!stock || (stock && stock.stock < detail.quantity)) {
          // Find nearest warehouse with sufficient stock
          const warehouses = await Warehouse.findAll({
            include: [
              {
                model: Stock,
                where: {
                  products_id: detail.products_id,
                  stock: {
                    [Op.gte]: detail.quantity,
                  },
                },
              },
            ],
          });

          if (warehouses.length === 0) {
            // await order.update({ status: 'FAILED' });
            return res.status(400).json({ message: "Not enough stock available" });
          }

          const currentWarehouse = await Warehouse.findByPk(warehouse.id);

          let nearestWarehouse;
          let minDistance = Number.MAX_VALUE;

          warehouses.forEach((warehouse) => {
            const distance = haversineDistance(currentWarehouse.latitude, currentWarehouse.longitude, warehouse.latitude, warehouse.longitude);

            if (distance < minDistance) {
              minDistance = distance;
              nearestWarehouse = warehouse;
            }
          });

          // Update stock in both warehouses
          const transferQuantity = detail.quantity - (stock ? stock.stock : 0);

          const nearestWarehouseStock = await Stock.findOne({
            where: { products_id: detail.products_id, warehouses_id: nearestWarehouse.id },
          });

          // create Stock Mutation Auto
          await StockMutation.create(
            {
              from_warehouse_id: nearestWarehouse.id,
              to_warehouse_id: warehouse.id,
              quantity: transferQuantity,
              mutation_type: "Automatic Transfer from nearest warehouse",
              products_id: detail.products_id,
            },
            { transaction: t }
          );

          // Update stock history for the nearest warehouse
          await StockHistory.create(
            {
              stock_before: nearestWarehouseStock.stock,
              stock_after: nearestWarehouseStock.stock - transferQuantity,
              products_id: detail.products_id,
              warehouses_id: nearestWarehouse.id,
              description: "Send Stock to request warehouse",
            },
            { transaction: t }
          );

          // if (stock) {
          //   // await stock.update({ stock: stock.stock + transferQuantity }, { transaction: t });
          // } else {
          //   await Stock.create(
          //     {
          //       stock: transferQuantity,
          //       products_id: detail.products_id,
          //       warehouses_id: order.warehouses_id,
          //     },
          //     { transaction: t }
          //   );
          // }

          if (!stock) {
            await Stock.create(
              {
                stock: 0,
                products_id: detail.products_id,
                warehouses_id: order.warehouses_id,
              },
              { transaction: t }
            );
          }

          // Update stock history for the current warehouse
          await StockHistory.create(
            {
              stock_before: stock ? stock.stock : 0,
              stock_after: (stock ? stock.stock : 0) + transferQuantity,
              products_id: detail.products_id,
              warehouses_id: order.warehouses_id,
              description: "Receiving Stock from nearest warehouse",
            },
            { transaction: t }
          );

          // update stock history to the user address
          await StockHistory.create(
            {
              // stock_before: stock.stock + transferQuantity,
              // stock_after: stock.stock + transferQuantity - detail.quantity,
              stock_before: stock ? stock.stock + transferQuantity : detail.quantity,
              stock_after: stock ? stock.stock + transferQuantity - detail.quantity : 0,
              products_id: detail.products_id,
              warehouses_id: warehouse.id,
              description: "Send to buyer address",
            },
            { transaction: t }
          );
          if (stock) {
            await stock.update({ stock: stock.stock + transferQuantity - detail.quantity }, { transaction: t });
          }
          await nearestWarehouseStock.update(
            {
              stock: nearestWarehouseStock.stock - transferQuantity,
            },
            { transaction: t }
          );
        } else {
          await stock.update({ stock: stock.stock - detail.quantity }, { transaction: t });
          await StockHistory.create(
            {
              stock_before: stock.stock + detail.quantity,
              stock_after: stock.stock,
              products_id: detail.products_id,
              warehouses_id: warehouse.id,
              description: "Send to buyer address",
            },
            { transaction: t }
          );
        }
      }
      await t.commit();
      res.json({ message: "Order accepted and processed" });
    } catch (err) {
      await t.rollback();
      console.log(err);
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
      await order.update({ status: "Waiting for payment" });
      res.json({ message: 'Order rejected and status reverted to "Waiting for Payment"' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
