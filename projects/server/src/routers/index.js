//Sample syntax

// const userRouters = require("./userRouters");

// module.exports = {
//   userRouters,
// };

const adminsRouter = require("./admins");
const warehousesRouter = require("./warehouses");

module.exports = {
  adminsRouter,
  warehousesRouter,
};
