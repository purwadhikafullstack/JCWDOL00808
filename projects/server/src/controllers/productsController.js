// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const products = db.products;
const product_categories = db.product_categories;

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
};
