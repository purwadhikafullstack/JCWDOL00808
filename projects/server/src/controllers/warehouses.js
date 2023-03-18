const db = require("../../models/index");
const WarehousesModel = db.warehouses;
const request = require("request");
const fs = require("fs");
// const XMLHttpRequest = require("xhr2");

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
      console.log("req.body update warehouse:", req.body);
      const { id, name, address, province, city } = req.body;
      const updatedWarehouse = await WarehousesModel.update({ name, address, province, city }, { where: { id: req.body.id } });

      // const { id, name, address, province, city, district, latitude, longitude } = req.body;
      // const updatedWarehouse = await WarehousesModel.update({ name, address, province, city, district, latitude, longitude }, { where: { id } });

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
  assignAdmin: async (req, res) => {
    try {
      console.log("req.body: ", req.body);
      let update = await WarehousesModel.update(
        {
          admins_id: req.body.admins_id,
        },
        { where: { id: req.body.id } }
      );
      return res.status(200).send({
        success: true,
        message: "Admin has been assigned!",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send(err);
    }
  },
};
// getOpenCageData: async (req, res) => {
//   let api_key = "3b50c98b083b4331ab5b460ac164e3c2";
//   let api_url = "https://api.opencagedata.com/geocode/v1/json";

//   let request_url = api_url + "?" + "key=" + api_key + "&q=" + encodeURIComponent("antapani") + "&pretty=1" + "&no_annotations=1";

//   let request = new XMLHttpRequest();
//   request.open("GET", request_url, true);

//   request.onload = function () {
//     if (request.status === 200) {
//       // Success!
//       let data = JSON.parse(request.responseText);
//       // alert(data.results[0].formatted); // print the location
//     } else if (request.status <= 500) {
//       // We reached our target server, but it returned an error

//       console.log("unable to geocode! Response code: " + request.status);
//       let data = JSON.parse(request.responseText);
//       console.log("error msg: " + data.status.message);
//     } else {
//       console.log("server error");
//     }
//   };

//   request.onerror = function () {
//     // There was a connection error of some sort
//     console.log("unable to connect to server");
//   };

//   request.send(); // make the request
// },

// dariMasAji: async (req,res) => {
//   try {
//     let {warehouse_id} = req.dataDecode
//     let {name, address, province, city, district, latitude, longitude} = req.body
//     let response = await geocode ({q: `${district}`, countrycode: "id", limit: 1, key: "3b50c98b083b4331ab5b460ac164e3c2"})

//     res.status(200).send({success: true, dataAPI:response.results[0].geometry})
//   } catch (error) {
//     res.status(400).send({success: false,message: "Error"})
//   }
// },
