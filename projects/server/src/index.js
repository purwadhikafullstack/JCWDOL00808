const { join } = require("path");
require('dotenv').config({path:join(__dirname,'../.env')});
const express = require("express");
const cors = require("cors");

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
// const Models = require("./models");
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

app.get("/api", (req, res) => {
   res.send(`Hello, this is my API`);
);

app.get("/api/greetings", (req, res, next) => {
res.status(200).json({
     message: "Hello, Student !",
   });
});

// ===========================

// // not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

// // error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
    res.status(500).send(err);
  } else {
    next();
  }
});

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
  confirmOrderRouter,
  salesReportRouter,
} = require("./routers"); //refer to index.js in routers folder

app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/admins", adminsRouter);
app.use("/api/warehouses", warehousesRouter);
app.use("/api/admin", adminRouter, confirmOrderRouter, salesReportRouter);
app.use("/api/products", productsRouter);
app.use("/api/product", productRouter);
app.use("/api/productcategory", productCategoryRouter);
app.use("/api/mutations", stockMutationRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/address", addressesRouter);
app.use("/api/histories", historiesRouter);
app.use("/api/orders", ordersRouter);

// app.use(express.static("."));

//#endregion

// #region CLIENT
const clientPath = "../../client/build";
// app.use("/public", express.static(join(__dirname, "src/public")));
app.use(express.static(join(__dirname, clientPath)));
app.use("/public", express.static(join(__dirname, "../src/public")));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
