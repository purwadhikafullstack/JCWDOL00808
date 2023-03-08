const express = require("express");
const route = express.Router();
const { adminsController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");

route.get("/", adminsController.getData);
route.post("/login", adminsController.login);
route.post("/register", adminsController.register);
// route.get("/keeplogin", verifyToken, adminsController.keeplogin);

module.exports = route;
