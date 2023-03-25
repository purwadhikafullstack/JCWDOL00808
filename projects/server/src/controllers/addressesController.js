// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

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

const request = require("request");


module.exports = {
  addAddress: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      let { id } = req.dataDecode
      let { address, province, city, district, postal_code, recipient, phone_number, is_primary } = req.body

      let response = await geocode({ q: `${address}, ${district}, ${city}, ${province}`, countrycode: 'id', limit: 1, key: process.env.API_KEY })
      let { lat, lng } = response.results[0].geometry

      if (is_primary == 1) {
        const removePrimary = await user_addresses.update({is_primary: 0}, { where: { users_id: id } }, { transaction: t })
        const createNewAddress = await user_addresses.create({ address, province: province.split(",")[1], city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng, users_id: id }, { transaction: t })
        t.commit();
        navigate("/user/address");
      res.status(201).send({
        isError: false,
        message: "Address created.",
        data: createNewAddress,
        dataAPI: response.results[0].geometry
      });
      } else {
      const createNewAddress = await user_addresses.create({ address, province: province.split(",")[1], city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng, users_id: id }, { transaction: t })
      t.commit();
      navigate("/user/address");
      res.status(201).send({
        isError: false,
        message: "Address created.",
        data: createNewAddress,
        dataAPI: response.results[0].geometry
      });
      }

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
      const search = req.query.search_query || "";
      let {id} = req.dataDecode
      const result = await user_addresses.findAll({
        where: {
          [Op.or]: [
            {
              address: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              province: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              city: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              district: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              postal_code: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              recipient: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              phone_number: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        }
      })
      const getAllAddress = await user_addresses.findAll({ where: { users_id: id } })
      
      res.json({
        result: result
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
      let { id } = req.dataDecode
      const  idAddress  = req.params;
      let { address, province, city, district, postal_code, recipient, phone_number, is_primary } = req.body

      let response = await geocode({ q: `${address}, ${district}, ${city}, ${province}`, countrycode: 'id', limit: 1, key: process.env.API_KEY })
      let { lat, lng } = response.results[0].geometry

      // let updateAdress = await user_addresses.update({ address, province, city, district, postal_code, recipient, phone_number,latitude: lat, longitude: lng, is_primary }, { where: { id } }, { transaction: t })

      if (is_primary == 1) {
        const removePrimary = await user_addresses.update({is_primary: 0}, { where: { users_id: id } }, { transaction: t })
        const updateAddress = await user_addresses.update({ address, province: province.split(",")[1], city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng, users_id: id }, { where: { id: idAddress.id } }, { transaction: t })
        t.commit();
      res.status(201).send({
        isError: false,
        message: "Address updated.",
        data: updateAddress,
        dataAPI: response.results[0].geometry
      });
      } else {
      const updateAddress = await user_addresses.update({ address, province: province.split(",")[1], city, district, postal_code, recipient, phone_number, is_primary, latitude: lat, longitude: lng, users_id: id }, { where: { id: idAddress.id } }, { transaction: t })
     
      t.commit();
      res.status(201).send({
        isError: false,
        message: "Address updated.",
        data: updateAddress,
        dataAPI: response.results[0].geometry
      });
      }

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
      let { id } = req.params

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
      const address = await user_addresses.findByPk(id);
      if (!address) {
        return res.status(404).json({ message: "Address not found" });
      }
      return res.status(200).json(address);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getProvinceData: async (req, res) => {
    let options = {
      method: "GET",
      url: "https://api.rajaongkir.com/starter/province",
      headers: { key: "ad56687941df3108ced06eb27098deea" },
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
      headers: { key: "ad56687941df3108ced06eb27098deea" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(body);
      let data = JSON.parse(body).rajaongkir.results;
      res.status(200).send(data);
    });
  },
}