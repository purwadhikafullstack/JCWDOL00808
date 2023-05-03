const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
const { Op, QueryTypes, Sequelize } = require("sequelize");

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

      let data = await Models.stock_histories.findAll({
        where: {
          products_id: sortProductsId,
          warehouses_id: sortWarehouseId,
          createdAt: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  "MONTH",
                  Sequelize.col("stock_histories.createdAt")
                ),
                month
              ),
              Sequelize.where(
                Sequelize.fn(
                  "YEAR",
                  Sequelize.col("stock_histories.createdAt")
                ),
                year
              ),
            ],
          },
        },
        include: [
          {
            model: Models.products,
            attributes: ["name"],
            where: {
              id: sortProductsId,
            },
          },
          {
            model: Models.warehouses,
            attributes: ["name"],
            where: {
              id: sortWarehouseId,
            },
          },
        ],
      });

      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
