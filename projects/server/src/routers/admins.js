const express = require("express");
const route = express.Router();
const { adminsController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");
const { validateLoginAdmin } = require("../middleware/validator");

route.get("/getAdminsData", adminsController.getAdminsData);
route.post("/login", validateLoginAdmin, adminsController.login);
route.post("/register", adminsController.register);
route.get("/availableWarehouse", adminsController.availableWarehouse);
route.patch("/assignNewAdmin", adminsController.assignNewAdmin);
route.get("/dashboardData", verifyToken, adminsController.dashboardData);

module.exports = route;
