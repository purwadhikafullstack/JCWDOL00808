const db = require("../../models/index");
const WarehousesModel = db.warehouses;
const request = require("request");

// 1. import library geocode
const { geocode } = require("opencage-api-client");
const fs = require("fs");

const { sequelize } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  getAllWarehouse: async (req, res) => {
    try {
      let data = await WarehousesModel.findAll()
      return res.status(200).send(data)
    } catch (error) {
      console.log(error);
      return res.status(500).send(error)
    }
  },
  getProvinceData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: "c80fa8beeb5eeb737ca76afcf8939a56" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      let data = JSON.parse(body).rajaongkir.results;
      res.status(200).send(data);
    });
  },
  getCityData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/city",
      qs: { province: req.query.province_id },
      headers: { key: "c80fa8beeb5eeb737ca76afcf8939a56" },
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
      const order = req.query.order || "ASC"
      const keyword = req.query.keyword || ""

      let WarehouseData = await WarehousesModel.findAndCountAll({
        limit,
        offset,
        order: [[sort, order]],
        where: {
          [Op.or]: [
            { name: {
              [Op.like]: "%" + keyword + "%"
            }
          },
            { address: {
              [Op.like]: "%" + keyword + "%"
            }
          },
            { city: {
              [Op.like]: "%" + keyword + "%"
            }
          },
            { province: {
              [Op.like]: "%" + keyword + "%"
            }
          },
          ]
        }
      });
      res.status(200).send({ ...WarehouseData, totalPage: Math.ceil(WarehouseData.count / limit) });
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
      // fungsi geocode tuh ngolah parameter yang dikasih (bisa alamat, kode negara, API key)
      let response = await geocode({ q: `${address}, ${district}, ${province}, ${city}`, countrycode: "id", limit: 1, key: "3b50c98b083b4331ab5b460ac164e3c2" });
      console.log(response); // buat liat hasil olah dari fungsi geocode. response berupa lat, lng

      // 4. destructure response dari geocode
      let { lat, lng } = response.results[0].geometry;

      // 5. gunakan latitude & longitude sesuai kebutuhan
      let createNewWarehouse = await WarehousesModel.create({ name, address, province, city, district, latitude: lat, longitude: lng });

      res.status(200).send({ success: true, message: "New warehouse data added", dataAPI: response.results[0].geometry });
    } catch (error) {
      res.status(400).send({ success: false, message: "Error" });
    }
  },
  updateWarehouseData: async (req, res) => {
    try {
      console.log("req.body update warehouse:", req.body);
      const { id, name, address, province, city, district } = req.body;
      let response = await geocode({ q: `${address}, ${district}, ${province}, ${city}`, countrycode: "id", limit: 1, key: "3b50c98b083b4331ab5b460ac164e3c2" });
      let { lat, lng } = response.results[0].geometry;

      const updatedWarehouse = await WarehousesModel.update({ name, address, province, city, district, latitude: lat, longitude: lng }, { where: { id: req.body.id } });

      res.status(200).send({ success: true, message: "Warehouse data update success!" });
    } catch (error) {
      res.status(500).send({ success: false, message: "Error updating warehouse data", error: error });
    }
  },
  deleteWarehouseData: async (req, res) => {
    try {
      let deletedWarehouse = await WarehousesModel.findAll({ where: { id: req.query.id } });

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
      const { id } = req.params;
      let data = await WarehousesModel.findOne({ where: { id } });
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
};
