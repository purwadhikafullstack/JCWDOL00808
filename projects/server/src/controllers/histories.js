const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
const { Op } = require("sequelize");

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
      //   const sortPeriod = req.query.sortPeriod || "";

      let data = await StockHistoriesModel.findAll({
        where: {
          [Op.or]: [
            {
              products_id: sortProductsId,
            },
            {
              warehouses_id: sortWarehouseId,
            },
          ],
        },
        //     order: [[sortProductsId, sortWarehouseId, sortPeriod]],
      });
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
