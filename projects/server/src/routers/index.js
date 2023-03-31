const usersRouter = require("./usersRouter");
const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");
const adminsRouter = require("./admins");
const warehousesRouter = require("./warehouses");
const productsRouter = require("./productsRouter");
const productRouter = require("./productRouter");
const productCategoryRouter = require("./productCategoryRouter");
const stockMutationRouter = require("./stockMutationRouter");
const cartsRouter = require("./cartsRouter");
const addressesRouter = require("./addresesRouter");
const historiesRouter = require("./histories")

module.exports = {
  usersRouter,
  authRouter,
  adminRouter,
  adminsRouter,
  warehousesRouter,
  productsRouter,
  productRouter,
  productCategoryRouter,
  stockMutationRouter,
  cartsRouter,
  addressesRouter,
  historiesRouter,
};
