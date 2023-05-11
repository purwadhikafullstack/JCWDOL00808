const express = require("express");
const Router = express.Router();

// Import Controller
const { adminAccountController } = require("../controllers");
const { uploadImages, uploadImagesProduct } = require("../middleware/uploadImage");

Router.get("/getAdmin", adminAccountController.getUserAdmin);
Router.get("/getAdminById/:id", adminAccountController.getUserAdminById);
Router.get("/getAdminUserList", adminAccountController.getUserList);
Router.post("/registerAdmin", uploadImages, adminAccountController.register);
Router.patch("/patchAdminImage/:id", uploadImages, adminAccountController.patchAdmin);
Router.patch("/patchAdmin/:id", adminAccountController.patchAdmin);
Router.delete("/deleteAdmin/:id", adminAccountController.deleteAdmin);
Router.patch("/changePassword/:id", adminAccountController.changePassword);

module.exports = Router;
