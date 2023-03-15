const express = require("express");
const Router = express.Router();

const { productsController } = require("../controllers");

Router.get("/category", productsController.getCategories);

module.exports = Router;
