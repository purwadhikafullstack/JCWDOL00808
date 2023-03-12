// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const products = db.products;

// import JOI untuk validasi input dari user
const Joi = require("joi");

//import delete files images
const deleteFiles = require("../helper/deleteFiles");

module.exports = {
  getProducts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const sort = req.query.sort || "id"; //default sorting by id
      const order = req.query.order || "DESC"; //default order DESC
      const totalRows = await products.count({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              price: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await products.findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: "%" + search + "%",
              },
            },
            {
              price: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
        offset: offset,
        limit: limit,
        order: [[sort, order]], // add order clause with the sort and order parameters
      });
      res.json({
        result: result,
        page: page,
        limit: limit,
        totalRows: totalRows,
        totalPage: totalPage,
      });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },

  addProducts: async (req, res) => {
    const t = await sequelize.transaction();

    const productSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      weight: Joi.number().required(),
    });

    try {
      let imageUrl = req.files.imageUrl[0].path;
     

      // Validate input data against schema
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).send({
          isError: true,
          message: error.details[0].message,
          data: null,
        });
      }

      const { name, description, price, weight } = value;

      // step 2 validasi
      let findNameProducts = await products.findOne({
        where: {
          name: name,
        },
      });

      if (findNameProducts)
        return res.status(404).send({
          isError: true,
          message: "Name Product is exist",
          data: null,
        });

      // insert data ke products
      await products.create({ name, description, price, weight, imageUrl }, { transaction: t });

      //step 5 kirim response
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "Add products success",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  patchProduct: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const productSchema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required(),
        weight: Joi.number().required(),
      });

      const { error, value } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).send({
          isError: true,
          message: error.details[0].message,
          data: null,
        });
      }

      // step 1: retrieve admin data from database
      const { id } = req.params;
      let product = await products.findOne({ where: { id: id } });
      if (!product) {
        await t.rollback();
        return res.status(404).send({
          isError: true,
          message: "products not found",
          data: null,
        });
      }

      // step 2: update product data based on request body
      let { name, description, price, weight } = value;
      if (name) {
        let findName = await products.findOne({
          where: {
            name,
            id: { [Op.ne]: product.id }, // exclude current product
          },
        });

        //check email to prevent the same email in db
        if (findName) {
          return res.status(400).send({
            isError: true,
            message: "Name Product already exists",
            data: null,
          });
        }
        product.name = name;
      }
      if (description) {
        product.description = description;
      }
      if (price) {
        product.price = price;
      }
      if (weight) {
        product.weight = weight;
      }
      if (req.files && req.files.imageUrl) {
        product.imageUrl = req.files.imageUrl[0].path;
      }
      await product.save({ transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Product data updated successfully",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },

  deleteProduct: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // step 1: retrieve admin data from database
      const { id } = req.params;
      let product = await products.findOne({ where: { id: id } });
      if (!product) {
        return res.status(404).send({
          isError: true,
          message: "product not found",
          data: null,
        });
      }

      // step 2: delete admin data from database
      await products.destroy({ where: { id: id } }, { transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "product deleted successfully",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
