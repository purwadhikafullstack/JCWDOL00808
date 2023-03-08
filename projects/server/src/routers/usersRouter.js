const express = require("express");
const Router = express.Router();

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", usersController.register);
Router.post("/login", usersController.login);

module.exports = Router;