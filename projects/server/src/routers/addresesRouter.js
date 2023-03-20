const express = require("express");
const Router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { addressesController } = require("../controllers");

Router.post("/add-address", addressesController.addAddress);
Router.get("/get-address", addressesController.getAddress);
Router.patch("/edit-address/:id", addressesController.editAddress);
Router.delete("/delete-address/:id", addressesController.deleteAddress);

module.exports = Router;
