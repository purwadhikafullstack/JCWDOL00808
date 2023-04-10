const usersController = require("./usersController");
const authController = require("./authController");
const adminAccountController = require("./adminAccountController");
const adminsController = require("./admins");
const productController = require("./productController");
const categoryProductController = require("./categoryProductController");
const warehousesController = require("./warehouses");
const productsController = require("./productsController");
const stockMutation = require("./stockMutations");
const addressesController = require("./addressesController");const historiesController = require("./histories")
const cartsController = require("./cartsController");


module.exports = {
  usersController,
  authController,
  adminAccountController,
  adminsController,
  categoryProductController,
  warehousesController,
  productsController,
  productController,
  stockMutation,
  cartsController,
  addressesController,
  historiesController,
};
