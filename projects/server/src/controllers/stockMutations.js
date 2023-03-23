// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const products = db.products;
const product_categories = db.product_categories;
const stocks = db.stocks;
const warehouses = db.warehouses;
const stock_mutations = db.stock_mutations;
const admin = db.admins;

// Import verification token function
const { createVerificationToken, validateVerificationToken } = require("../helper/verificationToken");

// import validation schema
const requestStockSchema = require;

module.exports = {
  requestStock: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { from_warehouse_id, to_warehouse_id, quantity, products_id } = req.body;

      const stock = await stocks.findOne({
        where: { warehouses_id: from_warehouse_id, products_id },
      });

      if (!stock || stock.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      const stockMutation = await stock_mutations.create(
        {
          from_warehouse_id,
          to_warehouse_id,
          products_id,
          quantity,
          mutation_type: "Manual",
        },
        { transaction: t }
      );

      await t.commit();
      res.status(201).json({ message: "Stock request created", stockMutation });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: "Server error", error });
    }
  },

  confirmRequest: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { status } = req.body;

      const stockMutation = await stock_mutations.findByPk(id);

      if (!stockMutation) {
        return res.status(404).json({ message: "Stock request not found" });
      }

      if (status === "ACCEPT") {
        const fromStock = await stocks.findOne({
          where: {
            warehouses_id: stockMutation.from_warehouse_id,
            products_id: stockMutation.products_id,
          },
        });

        if (fromStock.stock < stockMutation.quantity) {
          return res.status(400).json({ message: "Insufficient stock" });
        }

        fromStock.stock -= stockMutation.quantity;
        await fromStock.save();

        const [toStock, created] = await stocks.findOrCreate({
          where: {
            warehouses_id: stockMutation.to_warehouse_id,
            products_id: stockMutation.products_id,
          },
          defaults: { stock: 0 },
        });

        toStock.stock += stockMutation.quantity;
        await toStock.save();

        stockMutation.mutation_type = "TRANSFER";
        await stockMutation.save();

        res.status(200).json({ message: "Stock request accepted", stockMutation });
      } else if (status === "REJECT") {
        stockMutation.mutation_type = "REJECTED";
        await stockMutation.save();

        res.status(200).json({ message: "Stock request rejected", stockMutation });
      } else {
        res.status(400).json({ message: "Invalid status" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  },
};
