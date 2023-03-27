// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const stocks = db.stocks;
const stock_mutations = db.stock_mutations;
const stock_histories = db.stock_histories;

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
          mutation_type: "Pending",
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

        const fromStockBefore = fromStock.stock;
        fromStock.stock -= stockMutation.quantity;
        await fromStock.save({ transaction: t });

        const [toStock, created] = await stocks.findOrCreate({
          where: {
            warehouses_id: stockMutation.to_warehouse_id,
            products_id: stockMutation.products_id,
          },
          defaults: { stock: 0 },
        });

        const toStockBefore = toStock.stock;
        toStock.stock += stockMutation.quantity;
        await toStock.save({ transaction: t });

        // Create new stock history for the fromStock
        await stock_histories.create(
          {
            stock_before: fromStockBefore,
            stock_after: fromStock.stock,
            products_id: stockMutation.products_id,
            warehouses_id: stockMutation.from_warehouse_id,
            description: "Stock Mutation",
          },
          { transaction: t }
        );

        // Create new stock history for toStock
        await stock_histories.create(
          {
            stock_before: toStockBefore,
            stock_after: toStock.stock,
            products_id: stockMutation.products_id,
            warehouses_id: stockMutation.to_warehouse_id,
            description: "Stock Mutation",
          },
          { transaction: t }
        );

        stockMutation.mutation_type = "TRANSFER";
        stockMutation.approvedAt = new Date();
        await stockMutation.save({ transaction: t });

        //commit transaction
        await t.commit();
        res.status(200).json({ message: "Stock request accepted", stockMutation });
      } else if (status === "REJECT") {
        stockMutation.mutation_type = "REJECTED";
        stockMutation.approvedAt = new Date();

        await stockMutation.save({ transaction: t });
        await t.commit();

        res.status(200).json({ message: "Stock request rejected", stockMutation });
      } else {
        res.status(400).json({ message: "Invalid status" });
      }
    } catch (error) {
      await t.rollback();
      res.status(500).json({ message: "Server error", error });
    }
  },
};
