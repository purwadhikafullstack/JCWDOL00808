const express = require("express");
const Router = express.Router();
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", usersController.register);
Router.get("/verify/:email", usersController.isVerified);
Router.patch("/verify", usersController.verify);
Router.post("/login", usersController.login);
Router.patch(
  "/profile/:id/picture",
  uploadImages,
  usersController.changePicture
);
Router.delete("/profile/:id/picture", usersController.removePicture);

module.exports = Router;
