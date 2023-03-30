const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
const { Op, QueryTypes } = require("sequelize");

// import sequelize
const Models = require("../../models");

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
      const sortProductsId = req.query.sortProductsId || 0;
      const sortWarehouseId = req.query.sortWarehouseId || 0;
      const month = req.query.sortMonth || 0;
      const year = req.query.sortYear || 0;

      let data = await Models.sequelize.query(
        `SELECT * FROM stock_histories
      WHERE products_id = ${sortProductsId} and warehouses_id = ${sortWarehouseId} and month(createdAt) = ${month} and year(createdAt) = ${year};`,
        { type: QueryTypes.SELECT }
      );
      console.log(data);

      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  // tambah komen
};
