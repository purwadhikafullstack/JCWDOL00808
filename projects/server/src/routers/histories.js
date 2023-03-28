const express = require("express");
const route = express.Router();
const { historiesController } = require("../controllers");

route.get("/getStockHistories", historiesController.getStockHistories);
route.get("/getAllProducts", historiesController.getAllProducts);

module.exports = route;
