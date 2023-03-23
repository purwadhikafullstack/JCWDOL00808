const express = require("express");
const route = express.Router();
const { warehousesController } = require("../controllers");

route.get("/getWarehouseData", warehousesController.getWarehouseData);
route.post("/addWarehouse", warehousesController.addWarehouse);
route.patch("/updateWarehouseData", warehousesController.updateWarehouseData);
route.delete("/deleteWarehouseData", warehousesController.deleteWarehouseData);
route.get("/getProvinceData", warehousesController.getProvinceData);
route.get("/getCityData", warehousesController.getCityData);
route.patch("/assignAdmin", warehousesController.assignAdmin);
route.get("/getDistrictData", warehousesController.getDistrictData);

module.exports = route;
