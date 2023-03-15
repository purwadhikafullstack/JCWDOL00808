// Import Sequelize
const { sequelize } = require("../../models");
const { Op } = require("sequelize");

// Import models
const db = require("../../models/index");
const product_categories = db.product_categories;

// import JOI untuk validasi input dari user
const Joi = require("joi");

module.exports = {
  getProductCategory: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search_query || "";
      const offset = limit * page;
      const sort = req.query.sort || "category"; //default sorting by category
      const order = req.query.order || "DESC"; //default order DESC
      const totalRows = await product_categories.count({
        where: {
          [Op.or]: [
            {
              category: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      });
      const totalPage = Math.ceil(totalRows / limit);
      const result = await product_categories.findAll({
        where: {
          [Op.or]: [
            {
              category: {
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

  addProductCategory: async (req, res) => {
    const t = await sequelize.transaction();

    const productSchema = Joi.object({
      category: Joi.string().required(),
      description: Joi.string().required(),
    });

    try {
      // Validate input data against schema
      const { error, value } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).send({
          isError: true,
          message: error.details[0].message,
          data: null,
        });
      }

      const { category, description } = value;

      // step 2 validasi
      let findNameProductCategory = await product_categories.findOne({
        where: {
          category: category,
        },
      });

      if (findNameProductCategory)
        return res.status(409).send({
          isError: true,
          message: "Category Product is exist",
          data: null,
        });

      // insert data ke category
      await product_categories.create({ category, description }, { transaction: t });

      //step 5 kirim response
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "Add category products success",
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

  patchProductCategory: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const productSchema = Joi.object({
        category: Joi.string().required(),
        description: Joi.string().required(),
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
      let productCategory = await product_categories.findOne({ where: { id: id } });
      if (!productCategory) {
        await t.rollback();
        return res.status(404).send({
          isError: true,
          message: "Category product is not found",
          data: null,
        });
      }

      let { category, description } = value;
      if (category) {
        let findNameCategory = await product_categories.findOne({
          where: {
            category,
            id: { [Op.ne]: productCategory.id }, // exclude current product
          },
        });

        if (findNameCategory) {
          return res.status(400).send({
            isError: true,
            message: "Category product already exists",
            data: null,
          });
        }
        productCategory.category = category;
      }
      if (description) {
        productCategory.description = description;
      }

      await productCategory.save({ transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Category product data updated successfully",
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

  deleteProductCategory: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      // step 1: retrieve category data from database
      const { id } = req.params;
      let productCategory = await product_categories.findOne({ where: { id: id } });
      if (!productCategory) {
        return res.status(404).send({
          isError: true,
          message: "Category product not found",
          data: null,
        });
      }

      // step 2: delete category data from database
      await productCategory.destroy({ where: { id: id } }, { transaction: t });

      // step 3: send response
      await t.commit();
      res.status(200).send({
        isError: false,
        message: "Category product deleted successfully",
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

  getCategoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await product_categories.findByPk(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
