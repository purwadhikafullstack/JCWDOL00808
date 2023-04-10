const express = require("express");
const Router = express.Router();
const { verifyToken } = require("../middleware/verifyToken");
const { uploadImages, uploadImagesProduct } = require("../middleware/uploadImage");
const { validateRegister, validateVerification, validateEditProfile, validateEditPassword } = require("../middleware/validator");

// Import Controller
const { usersController } = require("../controllers");

Router.post("/register", validateRegister, usersController.register);
Router.get("/verify/:email", usersController.isVerified);
// Router.get("/verify-new-password/:email", usersController.isVerifiedNewPassword);
Router.patch("/verify", validateVerification, usersController.verify);
Router.patch("/verify-new-password", usersController.verifyNewPassword);
Router.post("/reset-password", usersController.resetPassword);
Router.post("/login", usersController.login);
Router.patch("/profile/picture", verifyToken, uploadImages, usersController.changePicture);
Router.delete("/profile/picture", verifyToken, usersController.removePicture);
Router.patch("/profile", verifyToken, validateEditProfile, usersController.editProfile);
Router.patch("/profile/password", verifyToken, validateEditPassword, usersController.editPassword);

module.exports = Router;
