const express = require("express");
const Router = express.Router();

// Import Controller
const { confirmOrder } = require("../controllers");

Router.get("/getPaymentConfirmation", confirmOrder.waiting_payment_confirmation);

module.exports = Router;
