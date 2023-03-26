const usersController = require("./usersController");
const authController = require("./authController");
const adminAccountController = require("./adminAccountController");
const adminsController = require("./admins");
const productController = require("./productController");
const categoryProductController = require("./categoryProductController");
const warehousesController = require("./warehouses");
const productsController = require("./productsController");
const addressesController = require("./addressesController")
const historiesController = require("./histories")


module.exports = {
  usersController,
  authController,
  adminAccountController,
  adminsController,
  categoryProductController,
  warehousesController,
  productsController,
  productController,
  addressesController,
  historiesController,
};
