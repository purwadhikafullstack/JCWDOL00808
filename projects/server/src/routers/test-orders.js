const express = require("express");
const route = express.Router();
const { testController } = require("../controllers");
const { verifyToken } = require("../middleware/verifyToken");

route.post("/test", testController.test);

module.exports = route;
