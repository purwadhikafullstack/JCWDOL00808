const express = require("express");
const Router = express.Router();

// Import Controller
const { stockMutation } = require("../controllers");

// import validator
const { validateRequestStock } = require("../middleware/validator");

//import verify Token
const { verifyRoleAdmin, verifyToken } = require("../middleware/verifyToken");

Router.post("/request-stock", verifyRoleAdmin, validateRequestStock, stockMutation.requestStock);
Router.patch("/confirm-mutation/:id", verifyToken, stockMutation.confirmRequest);
Router.get("/getrequest-stock", verifyToken, stockMutation.getStockRequest);

module.exports = Router;
