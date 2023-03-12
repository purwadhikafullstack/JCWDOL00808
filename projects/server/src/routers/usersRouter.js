const express = require("express");
const Router = express.Router();

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", usersController.register);
Router.get("/verify/:email", usersController.isVerified);
// Router.get("/verify-new-password/:email", usersController.isVerifiedNewPassword);
Router.patch("/verify", usersController.verify);
Router.patch("/verify-new-password", usersController.verifyNewPassword);
Router.post("/reset-password", usersController.resetPassword);
Router.post("/login", usersController.login);


module.exports = Router;
