const db = require("../../models/index");
const StockHistoriesModel = db.stock_histories;
const ProductsModel = db.products;
const WarehousesModel = db.warehouses;
const StocksModel = db.stocks;
const { Op, QueryTypes } = require("sequelize");
const sequelize = require("../../models/index");

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
      const admins_id = req.dataDecode.id;

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
  // getStockHistories: async (req, res) => {
  //   try {
  //     const sortProductsId = req.query.sortProductsId || 0;
  //     const sortWarehouseId = req.query.sortWarehouseId || 0;
  //     const month = req.query.sortMonth || 0;
  //     const year = req.query.sortYear || 0;

  //     // if (sortProductsId != 0 && sortWarehouseId == 0 && month != 0 && year != 0) {
  //     //   let data = await Models.sequelize.query(
  //     //     `SELECT stock_histories.stock_before, stock_histories.stock_after, products.name AS product
  //     //     FROM stock_histories
  //     //     JOIN products ON stock_histories.products_id = products.id
  //     //   WHERE stock_histories.products_id = ${sortProductsId} and month(stock_histories.createdAt) = ${month} and year(stock_histories.createdAt) = ${year};`,
  //     //     { type: QueryTypes.SELECT }
  //     //   );

  //     //   console.log(data);
  //     //   return res.status(200).send(data);
  //     // } else {
  //     let data = await Models.sequelize.query(
  //       `SELECT stock_histories.stock_before, stock_histories.stock_after, products.name AS product, warehouses.name AS warehouse
  //         FROM stock_histories
  //         JOIN products ON stock_histories.products_id = products.id
  //         JOIN warehouses ON stock_histories.warehouses_id = warehouses.id
  //       WHERE stock_histories.products_id = ${sortProductsId} and stock_histories.warehouses_id = ${sortWarehouseId} and month(stock_histories.createdAt) = ${month} and year(stock_histories.createdAt) = ${year};`,
  //       { type: QueryTypes.SELECT }
  //     );
  //     console.log(data);
  //     return res.status(200).send(data);
  //     // }
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).send(error);
  //   }
  // },
  getStockHistories: async (req, res) => {
    try {
      const sortProductsId = req.query.sortProductsId || 0;
      const sortWarehouseId = req.query.sortWarehouseId || 0;
      const month = req.query.sortMonth || 0;
      const year = req.query.sortYear || 0;

      let data = await Models.sequelize.query(
        `SELECT * FROM stock_histories
      WHERE month(createdAt) = ${month};`,
        { type: QueryTypes.SELECT }
      );
      // let data = await Models.sequelize.query(
      //   `SELECT * FROM stock_histories
      // WHERE products_id = ${sortProductsId} and warehouses_id = ${sortWarehouseId} and month(createdAt) = ${month} and year(createdAt) = ${year};`,
      //   { type: QueryTypes.SELECT }
      // );
      console.log(data);

      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getHistoryData: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = 7;
      const offset = limit * page;

      const sort = req.query.sort || "id";
      const order = req.query.order || "ASC";
      const keyword = req.query.keyword || "";
      const month = req.query.month || 0;

      let data = await StockHistoriesModel.findAndCountAll({
        include: [
          {
            model: ProductsModel,
            attributes: ["name"],
            as: "product",
          },
          {
            model: WarehousesModel,
            attributes: ["name"],
            as: "warehouse",
          },
        ],
        limit,
        offset,
        order: [[sort, order]],
        where: {
          [Op.or]: [
            {
              "$product.name$": {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              "$warehouse.name$": {
                [Op.like]: "%" + keyword + "%",
              },
            },
            // Models.sequelize.where(Models.sequelize.fn("MONTH", Models.sequelize.col("stock_histories.createdAt")), month),
            // Models.sequelize.fn('EXTRACT(MONTH from "createdAt") =', 2)
            Models.sequelize.literal(`EXTRACT(MONTH FROM "stock_histories.createdAt") = ${month}`),
          ],
        },
      });
      res.status(200).send(data);
    } catch (error) {
      console.log(error);
    }
  },
  test: async (req, res) => {
    try {
      // const admins_id = req.dataDecode.id;

      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;

      let filterStockHistory = {};
      let result = [];
      let warehouse = req.body.warehouse;
      let month1 = req.body.month;
      let year = req.body.year;

      if (warehouse !== "" && typeof warehouse !== "undefined") {
        filterStockHistory.warehouses_id = warehouse;
      }

      if (year !== "" && typeof year !== "undefined" && month1 !== "" && typeof month1 !== "undefined") {
        let bulan = parseInt(month1);
        let tahun = parseInt(year);
        startDate = new Date(`${tahun}-${bulan}-01`);
        endDate = bulan < 12 ? new Date(`${tahun}-${bulan + 1}-01`) : new Date(`${tahun + 1}-1-01`);

        filterStockHistory.updatedAt = {
          [Op.and]: {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          },
        };
      }

      // something to get the warehouse data
      let warehouseData = await WarehousesModel.findAll({
        raw: true,
      });

      // get products to show in product column in FE
      let productsData = await ProductsModel.findAndCountAll({
        include: [
          {
            model: StockHistoriesModel,
            where: filterStockHistory,
            // attributes: [],
          },
        ],
        distinct: true,
        col: "id",
        limit,
        offset,
      });

      let totalPage = Math.ceil(parseInt(productsData.count) / limit);

      // loop buat dapetin stock per product dalam periode tertentu (misal sebulan lalu)
      for (let i = 0; i < productsData.rows.length; i++) {
        let stockIn = 0;
        let stockOut = 0;
        let products_id = productsData.rows[i].id;
        filterStockHistory.products_id = products_id;
        let name = productsData.rows[i].name;
        let stockCount = await StockHistoriesModel.findAll({
          where: filterStockHistory,
          raw: true,
        });

        // loop untuk mencari stock in & stock out per product
        for (let j = 0; j < stockCount.length; j++) {
          let difference = stockCount[j].stock_after - stockCount[j].stock_before;
          if (difference < 0) {
            stockOut += Math.abs(difference);
          } else if (difference > 0) {
            stockIn += difference;
          }
        }

        // menentukan stock
        let latestStockChecker = await StockHistoriesModel.findOne({
          where: filterStockHistory,
          raw: true,
          order: [
            ["updatedAt", "desc"],
            ["id", "desc"],
          ],
        });
        let latestStock = latestStockChecker.stock_after;

        result.push({ name, products_id, stockIn, stockOut, latestStock });
      }

      res.status(200).send({
        success: true,
        message: "Ok",
        data: result,
        totalPage,
        warehouse: warehouseData,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Stock histories not available",
      });
    }
  },
  test2: async (req, res) => {
    try {
      let products_id = req.query;
      console.log("rq", req.query);
      let historyData = await StockHistoriesModel.findAll({
        where: { products_id },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong",
      });
    }
  },
};
