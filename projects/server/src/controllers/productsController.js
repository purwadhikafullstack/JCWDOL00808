// Import Sequelize
const { Sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const products = db.products;
const product_categories = db.product_categories;
const stocks = db.stocks;
const warehouses = db.warehouses;

// Import verification token function
const {
  createVerificationToken,
  validateVerificationToken,
} = require("../helper/verificationToken");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const allCategories = await product_categories.findAll();

      res.status(200).send({
        isError: false,
        message: "Get categories successful",
        data: allCategories,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        isError: false,
        message: error.message,
        data: null,
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await products.findOne({
        where: { id: productId },
        include: [
          {
            model: stocks,
            attributes: [],
            required: false,
          },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "price",
          "weight",
          "imageUrl",
          [Sequelize.fn("SUM", Sequelize.col("Stocks.stock")), "totalStock"],
        ],
        group: ["products.id"],
      });

      res.status(200).send({
        isError: false,
        message: "Get product details success",
        data: product,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const productsData = await products.findAll({
        include: [
          {
            model: stocks,
            attributes: [],
            required: false,
          },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "price",
          "weight",
          "imageUrl",
          [Sequelize.fn("SUM", Sequelize.col("Stocks.stock")), "totalStock"],
        ],
        group: ["products.id"],
      });

      res.status(200).send({
        isError: false,
        message: "Get all products data success",
        data: productsData,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        isError: false,
        message: error.message,
        data: null,
      });
    }
  },
};
