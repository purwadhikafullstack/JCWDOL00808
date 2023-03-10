const express = require("express");
const route = express.Router();
const { warehousesController } = require("../controllers");

// route.get("/", warehousesController.getData);
// route.patch("/editWarehouse", uploader(), warehousesController.editWarehouse)

module.exports = route;