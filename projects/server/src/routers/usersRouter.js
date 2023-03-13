const express = require("express");
const Router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const uploadImages = require("../middleware/uploadImage");

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", usersController.register);
Router.get("/verify/:email", usersController.isVerified);
Router.patch("/verify", usersController.verify);
Router.post("/login", usersController.login);
Router.patch(
  "/profile/picture",
  verifyToken,
  uploadImages,
  usersController.changePicture
);
Router.delete("/profile/picture", verifyToken, usersController.removePicture);
Router.patch("/profile", verifyToken, usersController.editProfile);
Router.patch("/profile/password", verifyToken, usersController.editPassword);

module.exports = Router;
