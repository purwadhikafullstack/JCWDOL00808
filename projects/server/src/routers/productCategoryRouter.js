const express = require("express");
const Router = express.Router();

// Import Controller
const { categoryProductController } = require("../controllers");

Router.post("/addcategoryproduct", categoryProductController.addProductCategory);
Router.patch("/patchcategoryproduct/:id", categoryProductController.patchProductCategory);
Router.get("/listproductcategory", categoryProductController.getProductCategory);
Router.delete("/deletecategoryproduct/:id", categoryProductController.deleteProductCategory);

module.exports = Router;
