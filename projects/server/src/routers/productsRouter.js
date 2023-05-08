const express = require("express");
const Router = express.Router();

const { productsController } = require("../controllers");

Router.get("/", productsController.getAllProducts);
Router.get("/category", productsController.getCategories);
Router.get("/:productId", productsController.getProductById);

module.exports = Router;
