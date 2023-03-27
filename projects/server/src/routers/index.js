const usersRouter = require("./usersRouter");
const authRouter = require("./authRouter");
const adminRouter = require("./adminRouter");
const adminsRouter = require("./admins");
const warehousesRouter = require("./warehouses");
const productsRouter = require("./productsRouter");
const productRouter = require("./productRouter");
const productCategoryRouter = require("./productCategoryRouter");
const stockMutationRouter = require("./stockMutationRouter");
const addressesRouter = require("./addresesRouter");

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
  addressesRouter,
};
