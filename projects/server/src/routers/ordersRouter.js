const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const { uploadPaymentProof } = require("../middleware/uploadImage");

// Import Controller
const { ordersController } = require("../controllers");

Router.get("/getOrderList", verifyToken, ordersController.getOrderList);
// Router.get("/getOrder", verifyToken, ordersController.getOrder);
Router.post("/cancelOrder", verifyToken, ordersController.cancelOrder);
Router.post("/add-order", verifyToken, ordersController.addOrder);
Router.get("/get-order", verifyToken, ordersController.getOrders);
Router.get("/getDetails", ordersController.getDetails);
Router.get("/get-order-details/:id", ordersController.getOrderDetails);
Router.get("/allorders-data/:id", ordersController.getOrdersById);
Router.post("/upload-payment-proof", verifyToken, uploadPaymentProof, ordersController.uploadPaymentProof);
Router.post("/cancel-order", verifyToken, ordersController.cancelUserOrder);
Router.post("/confirmDelivery", verifyToken, ordersController.confirmDelivery)

module.exports = Router;
