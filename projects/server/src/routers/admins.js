const express = require("express");
const route = express.Router();
const { adminsController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");

route.get("/getAdminsData", adminsController.getAdminsData);
route.post("/login", adminsController.login);
route.post("/register", adminsController.register);
route.patch("/assignNewAdmin", adminsController.assignNewAdmin);

module.exports = route;
