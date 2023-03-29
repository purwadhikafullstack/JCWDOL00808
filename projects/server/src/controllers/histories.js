const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
// const { Op, sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");

const dbConf = require("../../config/config");

module.exports = {
  getAllProducts: async (req, res) => {
    try {
      let data = await ProductsModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  getStockHistories: async (req, res) => {
    try {
      const products_id = req.query.sortProductsId || 0;
      const warehouses_id = req.query.sortWarehouseId || 0;
      const createdAt = req.query.sortPeriod || 0;

      console.log("createdAt: ", createdAt);
      if (products_id == 0 && warehouses_id == 0 && createdAt == 0) {
        let data = await StockHistoriesModel.findAll();

        return res.status(200).send(data);
      } else if (products_id == 0 && createdAt == 0) {
        let data = await StockHistoriesModel.findAll({
          where: {
            warehouses_id,
          },
        });

        return res.status(200).send(data);
      } else if (products_id == 0 && warehouses_id == 0) {
        let data = await StockHistoriesModel.findAll({
          where: sequelize.where(sequelize.fn("MONTH", sequelize.col("createdAt")), createdAt),
          // where: {
          //   createdAt: MONTH(createdAt)
          // }
          // where: {
          //   [Op.or]: [
          //     {
          //       createdAt: {
          //         [Op.like]: "%" + "-" + createdAt + "-" + "%",
          //       },
          //     },
          //   ],
          // },
        });

        return res.status(200).send(data);
      } else if (createdAt == 0 && warehouses_id == 0) {
        let data = await StockHistoriesModel.findAll({
          where: {
            products_id,
          },
        });

        return res.status(200).send(data);
      } else if (warehouses_id == 0) {
        let data = await StockHistoriesModel.findAll({
          where: {
            products_id,
            createdAt,
          },
        });

        return res.status(200).send(data);
      } else if (products_id == 0) {
        let data = await StockHistoriesModel.findAll({
          where: {
            warehouses_id,
            createdAt,
          },
        });

        return res.status(200).send(data);
      } else if (createdAt == 0) {
        let data = await StockHistoriesModel.findAll({
          where: {
            warehouses_id,
            products_id,
          },
        });

        return res.status(200).send(data);
      } else {
        let data = await StockHistoriesModel.findAll({
          where: {
            products_id,
            warehouses_id,
            createdAt,
          },
        });

        return res.status(200).send(data);
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  },

  // getStockHistories: (req, res) => {
  //   const products_id = req.query.sortProductsId || 0;
  //   const warehouses_id = req.query.sortWarehouseId || 0;
  //   const createdAt = req.query.sortPeriod || 0;

  //   console.log("products_id:", products_id);
  //   console.log("warehouses_id:", warehouses_id);
  //   console.log("createdAt: ", createdAt);
  //   let selectQuery = `SELECT * from stock_histories`;
  //   if (products_id == 0 && warehouses_id == 0 && createdAt == 0) {
  //     selectQuery = `SELECT * from stock_histories`;
  //   }
  //   dbConf.query(selectQuery, (err, result) => {
  //     if (err) {
  //       res.status(500).send(err);
  //     } else {
  //       res.status(200).send(result);
  //     }
  //   });
  // },
};
