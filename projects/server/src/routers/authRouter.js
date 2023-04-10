const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");

const { authController } = require("../controllers");

Router.get("/", verifyToken, authController.isAuth);

module.exports = Router;
