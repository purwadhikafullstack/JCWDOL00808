const express = require("express");
const route = express.Router();
const { warehousesController } = require("../controllers");

route.get("/getAllWarehouse", warehousesController.getAllWarehouse);
route.get("/getWarehouseData", warehousesController.getWarehouseData);
route.post("/addWarehouse", warehousesController.addWarehouse);
route.patch("/updateWarehouseData", warehousesController.updateWarehouseData);
route.delete("/deleteWarehouseData", warehousesController.deleteWarehouseData);
route.get("/getProvinceData", warehousesController.getProvinceData);
route.get("/getCityData", warehousesController.getCityData);
route.get("/getWarehouseDetails/:id", warehousesController.getWarehouseDetails)
route.post("/add-warehouse-product/:id", warehousesController.addWarehouseProduct)
route.get("/get-warehouse-product/:id", warehousesController.getWarehouseProduct)
route.patch("/update-stock-product/:id", warehousesController.updateWarehouseProduct)
route.get("/get-warehouse-product/:id", warehousesController.getWarehouseProductById)
route.delete("/delete-warehouse-product/:id", warehousesController.deleteWarehouseProduct)

module.exports = route;
