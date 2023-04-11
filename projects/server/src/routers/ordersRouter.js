const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { ordersController } = require("../controllers");

Router.post("/add-order", verifyToken, ordersController.addOrder);
Router.get("/get-order", ordersController.getOrders);

module.exports = Router;
