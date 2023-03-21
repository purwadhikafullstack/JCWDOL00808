const db = require("../../models/index");
const WarehousesModel = db.warehouses;
const request = require("request");
const fs = require("fs");

const { sequelize } = require("../../models");
const { where } = require("sequelize");

module.exports = {
  getProvinceData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: "c80fa8beeb5eeb737ca76afcf8939a56" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      console.log(body);
      fs.writeFileSync("./src/dbProvince.json", body);
      let data = JSON.parse(fs.readFileSync("./src/dbProvince.json"));
      res.status(200).send(data.rajaongkir.results);
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
      fs.writeFileSync("./src/dbCity.json", body);
      let data = JSON.parse(fs.readFileSync("./src/dbCity.json"));
      res.status(200).send(data.rajaongkir.results);
    });
  },
  getWarehouseData: async (req, res) => {
    try {
      // Ambil semua data admin dari database
      let WarehouseData = await WarehousesModel.findAll();
      res.status(200).send(WarehouseData);
    } catch (error) {
      console.error(error);
      res.status(500).send({ success: false, message: "Something is wrong." });
    }
  },
  addWarehouseData: async (req, res) => {
    try {
      // let { name, address, province, city, district, latitude, longitude } = req.body;
      // let insertToWarehouses = await WarehousesModel.create({ name, address, province, city, district, latitude, longitude });
      // console.log("insertToWarehouses:", insertToWarehouses);

      let { name, address, province, city } = req.body;
      let insertToWarehouses = await WarehousesModel.create({ name, address, province, city });
      console.log("insertToWarehouses:", insertToWarehouses);

      res.status(200).send({
        success: true,
        message: "New warehouse data added!",
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Warehouse data addition failed",
      });
    }
  },
  updateWarehouseData: async (req, res) => {
    try {
      const { id, name, address, province, city, district, latitude, longitude } = req.body;
      const updatedWarehouse = await WarehousesModel.update({ name, address, province, city, district, latitude, longitude }, { where: { id } });
      res.status(200).json({ success: true, message: "Warehouse data update success!", data: updatedWarehouse });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error updating warehouse data", error: error });
    }
  },
  deleteWarehouseData: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // step 1: retrieve admin data from database
      const { id } = req.params;
      let warehouseData = await WarehousesModel.findOne({ where: { id: id } });
      if (!warehouseData) {
        return res.status(500).send({
          isError: true,
          message: "Warehouse data can't be found.",
          data: null,
        });
      }

      // step 2: delete admin data from database
      await WarehousesModel.destroy({ where: { id: id } }, { transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Warehouse data successfully deleted!",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  assignAdmin: async (req, res) => {
    try {
      console.log("req.body: ", req.body);
        let update = await WarehousesModel.update(
          {
            admins_id: req.body.admins_id
          },
          { where: { id: req.body.id } }
        );
        return res.status(200).send({
          success: true,
          message: "Admin has been assigned!"
        })
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  }
  //   editWarehouse: async (req, res) => {
  //     // console.log("req.files: ", req.files);
  //     console.log("req.body: ", req.body);
  //     console.log("req.decript: ", req.decript);

  //     try {
  //       const { name, address, province, city, district, latitude, longitude, admins_id } = JSON.parse(req.body.data);
  //       const warehouse = await WarehousesModel.findByPk(req.decript.id);

  //       if (!warehouse) {
  //         return res.status(500).send({ success: false, message: "Warehouse not found!" });
  //       }

  //       warehouse.name = name;
  //       warehouse.address = address;
  //       warehouse.province = province;
  //       warehouse.city = city;
  //       warehouse.district = district;
  //       warehouse.latitude = latitude;
  //       warehouse.longitude = longitude;
  //       warehouse.admins_id = admins_id;

  //       await WarehousesModel.save();

  //       return res.status(200).send({ success: true, message: "Edit data warehouse success!" });
  //     } catch (error) {
  //       console.log(error);
  //       return res.status(500).send(error);
  //     }
  //   },
};
