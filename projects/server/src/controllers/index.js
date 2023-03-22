const usersController = require("./usersController");
const authController = require("./authController");
const adminAccountController = require("./adminAccountController");
const adminsController = require("./admins");
const productController = require("./productController");
const categoryProductController = require("./categoryProductController");
const warehousesController = require("./warehouses");
const productsController = require("./productsController");
// const productController = require("./productController");
const addressesController = require("./addressesController")


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
};
