const db = require("../../models/index");
const WarehousesModel = db.warehouses;
const stocks = db.stocks;
const stock_histories = db.stock_histories;
const request = require("request");

// 1. import library geocode
const { geocode } = require("opencage-api-client");
const fs = require("fs");
const products = db.products;
const product_categories = db.product_categories;
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getAllWarehouse: async (req, res) => {
    try {
      let data = await WarehousesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  getProvinceData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: process.env.RAJAONGKIR_API_KEY },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      let data = JSON.parse(body).rajaongkir.results;
      res.status(200).send(data);
    });
  },
  getCityData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      qs: { province: req.query.province_id },
      headers: { key: process.env.RAJAONGKIR_API_KEY },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      let data = JSON.parse(body).rajaongkir.results;
      res.status(200).send(data);
    });
  },

  getCostData: async (req, res) => {
    let options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        origin: req.query.originName,
        destination: req.query.destinationName,
        weight: req.query.totalWeight,
        courier: req.query.courier,
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      let data = JSON.parse(body).rajaongkir.results;
      res.status(200).send(data);
    });
  },

  getWarehouseData: async (req, res) => {
    try {
      console.log(req.query.page);
      const page = parseInt(req.query.page) || 0;
      const limit = 5;
      const offset = limit * page;

      const sort = req.query.sort || "id";
      const order = req.query.order || "ASC";
      const keyword = req.query.keyword || "";

      let WarehouseData = await WarehousesModel.findAndCountAll({
        limit,
        offset,
        order: [[sort, order]],
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              address: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + keyword + "%",
              },
            },
            {
              province: {
                [Op.like]: "%" + keyword + "%",
              },
            },
          ],
        },
      });
      res.status(200).send({
        ...WarehouseData,
        totalPage: Math.ceil(WarehouseData.count / limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Something is wrong." });
    }
  },
  addWarehouse: async (req, res) => {
    try {
      // 2. destructure object request body
      let { name, address, province, city, district } = req.body;

      // 3. q wajib ada buat ngirimin nilai address, district, province, city
      // mengolah parameter (alamat, kode negara, API key) dengan geocode
      let response = await geocode({
        q: `${address}, ${district}, ${province}, ${city}`,
        countrycode: "id",
        limit: 1,
        key: process.env.OPENCAGE_API_KEY,
      });
      console.log(response); // buat liat hasil olah dari fungsi geocode. response berupa lat, lng

      // 4. destructure response dari geocode
      let { lat, lng } = response.results[0].geometry;

      // 5. gunakan latitude & longitude sesuai kebutuhan
      let createNewWarehouse = await WarehousesModel.create({
        name,
        address,
        province,
        city,
        district,
        latitude: lat,
        longitude: lng,
      });

      res.status(200).send({
        success: true,
        message: "New warehouse data added",
        dataAPI: response.results[0].geometry,
      });
    } catch (error) {
      res.status(400).send({ success: false, message: "Error" });
    }
  },
  updateWarehouseData: async (req, res) => {
    try {
      const { id, name, address, province, city, district } = req.body;
      let response = await geocode({
        q: `${address}, ${district}, ${province}, ${city}`,
        countrycode: "id",
        limit: 1,
        key: process.env.OPENCAGE_API_KEY,
      });
      let { lat, lng } = response.results[0].geometry;

      const updatedWarehouse = await WarehousesModel.update(
        {
          name,
          address,
          province,
          city,
          district,
          latitude: lat,
          longitude: lng,
        },
        { where: { id: req.body.id } }
      );

      res.status(200).send({ success: true, message: "Warehouse data update success!" });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error updating warehouse data",
        error: error,
      });
    }
  },
  deleteWarehouseData: async (req, res) => {
    try {
      let deletedWarehouse = await WarehousesModel.findAll({
        where: { id: req.query.id },
      });

      await WarehousesModel.destroy({ where: { id: req.query.id } });

      console.log("deleted warehouse: ", deletedWarehouse);

      res.status(200).send({
        success: true,
        message: `Warehouse ${deletedWarehouse[0].name} has been deleted!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong.",
      });
    }
  },
  getWarehouseDetails: async (req, res) => {
    try {
      const id = req.query.id;
      let data = await WarehousesModel.findAll({ where: { id } });
      console.log("data details: ", data);

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Get warehouse details error",
      });
    }
  },
  addWarehouseProduct: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { id } = req.params;
      const { stock, products_id } = req.body;

      const checkProductStock = await stocks.findOne({
        where: { products_id, warehouses_id: id },
      });
      if (checkProductStock) {
        return res.status(409).send({
          isError: true,
          message: "Product already exist in warehouse.",
          data: null,
        });
      }

      const addedProductToWarehouse = await stocks.create({ stock, products_id, warehouses_id: id }, { transaction: t });
      const updateHistories = await stock_histories.create(
        {
          stock_before: 0,
          stock_after: stock,
          products_id,
          warehouses_id: id,
          description: "New Product added to warehouse",
        },
        { transaction: t }
      );
      t.commit();

      res.status(201).send({
        isError: false,
        message: "Product added to warehouse.",
        data: addedProductToWarehouse,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getWarehouseProduct: async (req, res) => {
    try {
      const search = req.query.search_query || "";
      const { id } = req.params;

      const data = await stocks.findAll({
        where: {
          [Op.and]: [
            { warehouses_id: id },
            { is_deleted: 0 },
            {
              [Op.or]: [
                {
                  "$warehouse.name$": {
                    [Op.like]: "%" + search + "%",
                  },
                },
                {
                  "$product.name$": {
                    [Op.like]: "%" + search + "%",
                  },
                },
                {
                  "$product.product_category.name$": {
                    [Op.like]: "%" + search + "%",
                  },
                },
              ],
            },
          ],
        },
        include: [
          {
            model: products,
            attributes: ["name"],
            include: [
              {
                model: product_categories,
                attributes: ["name"],
                as: "product_category",
              },
            ],
          },
          {
            model: WarehousesModel,
            attributes: ["name"],
            as: "warehouse",
          },
        ],
      });

      res.status(200).json({
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Get warehouse product error",
      });
    }
  },
  updateWarehouseProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const { stock, description } = req.body;

      const fromStock = await stocks.findByPk(id);

      if (!fromStock) {
        return res.status(404).send({
          isError: true,
          message: "Stock not found",
          data: null,
        });
      }

      const fromStockBefore = fromStock.stock;
      fromStock.stock += stock;
      await fromStock.save({ transaction: t });

      // const updatedWarehouseProduct = await stocks.update({ stock }, { where: { id }, transaction: t });
      const updateHistories = await stock_histories.create(
        {
          stock_before: fromStockBefore,
          stock_after: fromStock.stock,
          products_id: fromStock.products_id,
          warehouses_id: fromStock.warehouses_id,
          description,
        },
        { transaction: t }
      );
      t.commit();

      res.status(200).send({
        isError: false,
        message: "Warehouse product updated.",
        data: fromStock,
      });
    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  deleteWarehouseProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;
      const fromStock = await stocks.findByPk(id);

      if (!fromStock) {
        return res.status(404).send({
          isError: true,
          message: "Stock not found",
          data: null,
        });
      }

      const updateHistories = await stock_histories.create(
        {
          stock_before: fromStock.stock,
          stock_after: 0,
          products_id: fromStock.products_id,
          warehouses_id: fromStock.warehouses_id,
          description: "Stock deleted by admin",
        },
        { transaction: t }
      );
      // await stocks.destroy({ where: { id } });
      await stocks.update(
        { is_deleted: 1 }, // Set is_deleted to 1
        { where: { id }, transaction: t }
      );
      t.commit();
      const deletedWarehouseProduct = await stocks.findAll({ where: { id } });
      res.status(200).send({
        success: true,
        message: `Warehouse product ${deletedWarehouseProduct[0].name} has been deleted!`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something is wrong.",
      });
    }
  },
  getWarehouseProductById: async (req, res) => {
    try {
      const { id } = req.params;
      let data = await stocks.findOne({ where: { id } });
      // console.log("data details: ", data);

      res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        success: false,
        message: "Get warehouse product details error",
      });
    }
  },
  getWarehouseIdByAdminsId: async (req, res) => {
    try {
      let { id } = req.dataDecode;
      let data = await WarehousesModel.findAll({ where: { admins_id: id } });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
