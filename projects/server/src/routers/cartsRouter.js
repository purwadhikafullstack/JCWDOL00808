const express = require("express");
const Router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const { cartsController } = require("../controllers");

Router.get("/", verifyToken, cartsController.getCartData);
Router.patch("/", verifyToken, cartsController.updateCartData);
Router.delete("/", verifyToken, cartsController.deleteCartData);

module.exports = Router;
