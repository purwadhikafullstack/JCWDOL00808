const express = require("express");
const Router = express.Router();

// Import Controller
const { stockMutation } = require("../controllers");

// import validator
const { validateRequestStock } = require("../middleware/validator");

Router.post("/request-stock", validateRequestStock, stockMutation.requestStock);
Router.patch("/confirm-mutation/:id", stockMutation.confirmRequest);

module.exports = Router;
