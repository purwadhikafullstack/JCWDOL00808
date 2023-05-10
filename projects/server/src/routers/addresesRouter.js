const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
// const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { addressesController } = require("../controllers");

Router.post("/add-address", verifyToken, addressesController.addAddress);
Router.get("/get-address", verifyToken, addressesController.getAddress);
Router.get("/get-address/:id", addressesController.getAddressById);
Router.patch("/edit-address/:id", verifyToken, addressesController.editAddress);
Router.delete("/delete-address/:id", addressesController.deleteAddress);
Router.get("/getProvinceData", addressesController.getProvinceData);
Router.get("/getCityData", addressesController.getCityData);

module.exports = Router;
