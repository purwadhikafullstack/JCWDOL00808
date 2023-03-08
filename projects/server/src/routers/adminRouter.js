const express = require("express");
const Router = express.Router();

// Import Controller
const { adminAccountController } = require("../controllers");

Router.get("/getAdmin", adminAccountController.getUser);

module.exports = Router;
