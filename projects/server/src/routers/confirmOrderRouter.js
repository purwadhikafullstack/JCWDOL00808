const express = require("express");
const Router = express.Router();

// Import Controller
const { confirmOrderController } = require("../controllers");

Router.get("/getPaymentConfirmation", confirmOrderController.waiting_payment_confirmation);
Router.post("/acceptPayment/:id", confirmOrderController.acceptPayment);
Router.post("/rejectPayment/:id", confirmOrderController.rejectPayment);

module.exports = Router;
