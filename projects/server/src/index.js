const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
  cors()
  //   {
  //   origin: [
  //     process.env.WHITELISTED_DOMAIN &&
  //       process.env.WHITELISTED_DOMAIN.split(","),
  //   ],
  // }
);

app.use(express.json());

// Sequelize Model Synchronization (comment if not used)
// const Sequelize = require("sequelize");
// const Models = require("../models");
// Models.sequelize
//   .sync({
//     force: false,
//     alter: true,
//     logging: console.log,
//   })
//   .then(function () {
//     console.log("Database is Synchronized!");
//   })
//   .catch(function (err) {
//     console.log(err, "Something Went Wrong with Database Update!");
//   });

// #region API ROUTES

// ===========================
// NOTE : Add your routes here

// app.get("/api", (req, res) => {
//   res.send(`Hello, this is my API`);
// });

// app.get("/api/greetings", (req, res, next) => {
//   res.status(200).json({
//     message: "Hello, Student !",
//   });
// });

// ===========================

// // not found
// app.use((req, res, next) => {
//   if (req.path.includes("/api/")) {
//     res.status(404).send("Not found !");
//   } else {
//     next();
//   }
// });

// // error
// app.use((err, req, res, next) => {
//   if (req.path.includes("/api/")) {
//     console.error("Error : ", err.stack);
//     res.status(500).send("Error !");
//   } else {
//     next();
//   }
// });

//Import router for controller from index.js inside routers folder

const {
  usersRouter,
  authRouter,
  adminsRouter,
  warehousesRouter,
  adminRouter,
  productsRouter,
  productRouter,
  productCategoryRouter,
  cartsRouter,
  addressesRouter,
  stockMutationRouter,
  historiesRouter,
  ordersRouter,
} = require("./routers"); //refer to index.js in routers folder

app.use("/user", usersRouter);
app.use("/auth", authRouter);
app.use("/admins", adminsRouter);
app.use("/warehouses", warehousesRouter);
app.use("/admin", adminRouter);
app.use("/products", productsRouter);
app.use("/product", productRouter);
app.use("/productcategory", productCategoryRouter);
app.use("/mutations", stockMutationRouter);
app.use("/cart", cartsRouter);
app.use("/address", addressesRouter);
app.use("/histories", historiesRouter);
app.use("/orders", ordersRouter);

app.use(express.static("."));

//#endregion

// #region CLIENT
// const clientPath = "../../client/build";
// app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
// app.get("*", (req, res) => {
//   res.sendFile(join(__dirname, clientPath, "index.html"));
// });

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
