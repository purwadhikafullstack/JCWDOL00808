const express = require("express");
const route = express.Router();
const { historiesController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");

route.get("/getAllProducts", historiesController.getAllProducts);
route.get("/getWarehouseId", verifyToken, historiesController.getWarehouseId);
route.post("/getAllHistories", verifyToken, historiesController.getAllHistories);
route.get("/getHistoryDetails", verifyToken, historiesController.getHistoryDetails);

module.exports = route;
