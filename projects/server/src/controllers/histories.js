const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
const WarehousesModel = db.warehouses;
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
  autoGetStock: async (req, res) => {
    try {
      let data = await StockHistoriesModel.findAll({
        include: [
          {
            model: ProductsModel,
            attributes: ["name"],
          },
          {
            model: WarehousesModel,
            attributes: ["name"],
          },
        ],
      });

      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getStockHistories: async (req, res) => {
    try {
      const sortProductsId = req.query.sortProductsId || 0;
      const sortWarehouseId = req.query.sortWarehouseId || 0;
      const month = req.query.sortMonth || 0;
      const year = req.query.sortYear || 0;

      // if (sortProductsId != 0 && sortWarehouseId == 0 && month != 0 && year != 0) {
      //   let data = await Models.sequelize.query(
      //     `SELECT stock_histories.stock_before, stock_histories.stock_after, products.name AS product
      //     FROM stock_histories
      //     JOIN products ON stock_histories.products_id = products.id
      //   WHERE stock_histories.products_id = ${sortProductsId} and month(stock_histories.createdAt) = ${month} and year(stock_histories.createdAt) = ${year};`,
      //     { type: QueryTypes.SELECT }
      //   );

      //   console.log(data);
      //   return res.status(200).send(data);
      // } else {
      let data = await Models.sequelize.query(
        `SELECT stock_histories.stock_before, stock_histories.stock_after, products.name AS product, warehouses.name AS warehouse
          FROM stock_histories
          JOIN products ON stock_histories.products_id = products.id
          JOIN warehouses ON stock_histories.warehouses_id = warehouses.id
        WHERE stock_histories.products_id = ${sortProductsId} and stock_histories.warehouses_id = ${sortWarehouseId} and month(stock_histories.createdAt) = ${month} and year(stock_histories.createdAt) = ${year};`,
        { type: QueryTypes.SELECT }
      );
      console.log(data);
      return res.status(200).send(data);
      // }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  // getStockHistories: async (req, res) => {
  //   try {
  //     const sortProductsId = req.query.sortProductsId || 0;
  //     const sortWarehouseId = req.query.sortWarehouseId || 0;
  //     const month = req.query.sortMonth || 0;
  //     const year = req.query.sortYear || 0;

  //     let data = await Models.sequelize.query(
  //       `SELECT * FROM stock_histories
  //     WHERE products_id = ${sortProductsId} and warehouses_id = ${sortWarehouseId} and month(createdAt) = ${month} and year(createdAt) = ${year};`,
  //       { type: QueryTypes.SELECT }
  //     );
  //     console.log(data);

  //     return res.status(200).send(data);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).send(error);
  //   }
  // },
  getHistoryData: async (req,res) => {
    try {
      const sort = req.query.sort || "id"
      const order = req.query.order || "ASC"
      const keyword = req.query.keyword || ""

      let data = await StockHistoriesModel.findAndCountAll({
        order: [[sort, order]],
        where: {
          [Op.or]: [
            { product: {
              [Op.like]: "%" + keyword + "%"
            }},
            { warehouse: {
              [Op.like]: "%" + keyword + "%"
            }},
          ]
        }
      })
      res.status(200).send(data)
    } catch (error) {
      console.log(error);
    }
  }
};
