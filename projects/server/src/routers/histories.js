const express = require("express");
const route = express.Router();
const { historiesController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");

// route.get("/getStockHistories", historiesController.getStockHistories);
route.get("/getAllProducts", historiesController.getAllProducts);
// route.get("/autoGetStock", verifyToken, historiesController.autoGetStock);
// route.get("/getHistoryData", historiesController.getHistoryData);
route.post("/test", verifyToken, historiesController.test);
route.get("/test2", verifyToken, historiesController.test2);

module.exports = route;
