const express = require("express");
const route = express.Router();
const { adminsController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");
const { validateLoginAdmin } = require("../middleware/validator");

route.get("/getAdminsData", adminsController.getAdminsData);
route.post("/login", validateLoginAdmin, adminsController.login);
route.post("/register", adminsController.register);
route.patch("/assignNewAdmin", adminsController.assignNewAdmin);
route.get("/dashboardData", adminsController.dashboardData);

module.exports = route;
