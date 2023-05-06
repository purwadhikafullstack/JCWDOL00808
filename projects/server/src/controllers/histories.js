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

  test: async (req, res) => {
    try {
      const admins_id = req.dataDecode.id;

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
      let admins_id = req.dataDecode.id;

      let products_id = req.query.products_id;
      let stockQuery = req.query.stockQuery || "";
      let warehouseQuery = req.query.warehouseQuery || "";
      let month = req.query.month || "";

      let historyDetails = await StockHistoriesModel.findAll({
        include: {
          as: "warehouse",
        },
        where: {
          products_id,
          "$warehouse.name$": {
            [Op.like]: "%" + warehouseQuery + "%",
          },
          // sequelize.where(sequelize.fn("MONTH", sequelize.col("stock_histories.createdAt")), month),
          // sequelize.where()
          // sequelize.fn("MONTH", sequelize.col("TransactionItem.createdAt")),
        },
      });

      for (let i = 0; i < historyDetails.length; i++) {
        const dateA = historyDetails[i].createdAt;
        const dateB = new Date(dateA);

        const options = { day: "numeric", month: "long", year: "numeric" };
        const formattedDate = dateB.toLocaleDateString("id-ID", options);

        const timeFormatterOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
        const formattedTime = dateB.toLocaleTimeString("id-ID", timeFormatterOptions);

        const dateTimeString = `${formattedDate} ${formattedTime}`;

        historyDetails[i].dataValues.time = dateTimeString;

        // add qty in and qty out
        let difference = historyDetails[i].stock_after - historyDetails[i].stock_before;
        let stockIn = 0;
        let stockOut = 0;
        if (difference < 0) {
          stockOut += Math.abs(difference);
        } else {
          stockIn += difference;
        }

        historyDetails[i].dataValues.stockIn = stockIn;
        historyDetails[i].dataValues.stockOut = stockOut;
      }

      // filter history details by admin's input
      let stockInData = historyDetails.filter((value) => value.dataValues.stockIn > 0);
      let stockOutData = historyDetails.filter((value) => value.dataValues.stockOut > 0);

      // cari nama product berdasarkan products_id

      //
      if (stockQuery == "") {
        res.status(200).send({
          success: true,
          message: "Ok",
          data: historyDetails,
        });
      } else if (stockQuery == "stockIn") {
        res.status(200).send({
          success: true,
          message: "Ok",
          data: stockInData,
        });
      } else if (stockQuery == "stockOut") {
        res.status(200).send({
          success: true,
          message: "Ok",
          data: stockOutData,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong",
      });
    }
  },
};
