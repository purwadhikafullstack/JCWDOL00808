// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const user_addresses = db.user_addresses;
const users = db.users;

// Import verification token function
const {
  createVerificationToken,
  validateVerificationToken,
} = require("../helper/verificationToken");
// Import transporter function
const transporter = require("../helper/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");
const deleteFiles = require("../helper/deleteFiles");
// Import hash function
const { hashPassword, hashMatch } = require("../lib/hash");
const { error } = require("console");

//import opencage api
const { geocode } = require('opencage-api-client')

module.exports = {
  addAddress: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      let { id } = req.dataDecode
      let { address, province, city, district, postal_code, recipient, phone_number, is_primary } = req.body

      let response = await geocode({ q: `${address}, ${district}, ${city}, ${province}`, countrycode: 'id', limit: 1, key: process.env.API_KEY })
      let { lat, lng } = response.results[0].geometry

      // validation user_id still bug
      // const findUserId = await users.findOne({ where: { user_id } });
      // if (!findUserId) {
      //   res.status(409).send({
      //     isError: true,
      //     message: "User ID not found, please re-login.",
      //     data: null,
      //   });
      // } else {
      const createNewAddress = await user_addresses.create({ address, province, city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng, users_id: id }, { transaction: t })

      t.commit();
      res.status(201).send({
        isError: false,
        message: "Address created.",
        data: createNewAddress,
        dataAPI: response.results[0].geometry
      });
      // }

    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });

    }
  },
  getAddress: async (req, res) => {
    try {

      let {id} = req.dataDecode
      const getAllAddress = await user_addresses.findAll({ where: { users_id: id } })
      
      res.json({
        result: getAllAddress
      });
      // res.status(200).send({
      //   isError: false,
      //   message: "Get User Addresses",
      //   data: getAllAddress,
      // });

    } catch (error) {
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  editAddress: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      // const { user_id } = req.dataDecode
      let { address, province, city, district, postal_code, recipient, phone_number, is_primary, id } = req.body

      let response = await geocode({ q: `${address}, ${district}, ${city}, ${province}`, countrycode: 'id', limit: 1, key: process.env.API_KEY })
      let { lat, lng } = response.results[0].geometry

      let updateAdress = await user_addresses.update({ address, province, city, district, postal_code, recipient, phone_number,latitude: lat, longitude: lng, is_primary }, { where: { id } }, { transaction: t })

      t.commit()
      res.status(201).send({
        isError: false,
        message: "Address updated",
        data: { address, province, city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng },
      })

    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  deleteAddress: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { user_id } = req.dataDecode
      let { id } = req.body

      let deleteAdress = await user_addresses.destroy({ where: { id } }, { transaction: t })

      t.commit()
      res.status(201).send({
        isError: false,
        message: "Address deleted",
        data: true,
      })

    } catch (error) {
      t.rollback();
      res.status(409).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getAddressById : async (req, res) => {
    const { id } = req.params;
    try {
      const admin = await admins.findByPk(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      return res.status(200).json(admin);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
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
}
}