const express = require("express");
const Router = express.Router();
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", usersController.register);
Router.get("/verify/:email", usersController.isVerified);
Router.patch("/verify", usersController.verify);
Router.post("/login", usersController.login);
Router.patch("/profile/picture", uploadImages, usersController.changePicture);
Router.delete("/profile/picture", usersController.removePicture);
Router.patch("/profile", usersController.editProfile);
Router.patch("/profile/password", usersController.editPassword);

module.exports = Router;
