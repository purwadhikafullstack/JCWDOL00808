const express = require("express");
const Router = express.Router();

// Import Controller
const { productController } = require("../controllers");
const { uploadImagesProduct, uploadImages } = require("../middleware/uploadImage");

Router.post("/addproduct", uploadImagesProduct, productController.addProducts);
Router.patch("/patchproduct/:id", uploadImagesProduct, productController.patchProduct);
Router.get("/listproduct", productController.getProducts);
Router.get("/productId/:id", productController.getProductById);
Router.get("/getProductOnWarehouse", productController.getProductOnWarehouse);

Router.delete("/deleteproduct/:id", productController.deleteProduct);

module.exports = Router;
