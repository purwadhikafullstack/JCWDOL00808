const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { ordersController } = require("../controllers");

Router.get("/getOrderList", verifyToken, ordersController.getOrderList);
Router.post("/add-order", verifyToken, ordersController.addOrder);
Router.get("/get-order", verifyToken, ordersController.getOrders);
Router.get("/get-order-details/:id", ordersController.getOrderDetails);
Router.get("/allorders-data/:id", ordersController.getOrdersById);

module.exports = Router;
