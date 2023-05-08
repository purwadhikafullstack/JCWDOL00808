const express = require("express");
const Router = express.Router();
const { verifyToken, verifyRoleAdmin } = require("../middleware/verifyToken");

const { cartsController } = require("../controllers");

Router.get("/", verifyToken, cartsController.getCartData);
Router.get(
  "/quantity/:products_id",
  verifyToken,
  cartsController.getProductQuantityInCart
);
Router.post("/", verifyToken, cartsController.addProduct);
Router.patch("/", verifyToken, cartsController.updateCartData);
Router.delete("/:id", verifyToken, cartsController.deleteCartData);
Router.patch("/order/:id", verifyRoleAdmin, cartsController.deliverOrder);

module.exports = Router;
