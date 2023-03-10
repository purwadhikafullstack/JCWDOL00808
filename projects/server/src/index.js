const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const { join } = require("path");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(
<<<<<<< HEAD
  cors({
    // origin: [process.env.WHITELISTED_DOMAIN && process.env.WHITELISTED_DOMAIN.split(",")],
  })
=======
  cors(
  //   {
  //   origin: [
  //     process.env.WHITELISTED_DOMAIN &&
  //       process.env.WHITELISTED_DOMAIN.split(","),
  //   ],
  // }
  )
>>>>>>> 60f07d8d809db9868d9a82b0ca042a168bd849d8
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
<<<<<<< HEAD
const { usersRouter, adminsRouter, adminRouter } = require("./routers"); //refer to index.js in routers folder
app.use("/user", usersRouter);
app.use("/admins", adminsRouter);
app.use("/admin", adminRouter);
=======
const { usersRouter, adminsRouter, warehousesRouter } = require("./routers"); //refer to index.js in routers folder
app.use("/user", usersRouter);
app.use("/admins", adminsRouter);
app.use("/warehouses", warehousesRouter);
>>>>>>> 60f07d8d809db9868d9a82b0ca042a168bd849d8

//#endregion

// #region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

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
