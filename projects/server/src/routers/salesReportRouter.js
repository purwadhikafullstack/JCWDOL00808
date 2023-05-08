const express = require("express");
const Router = express.Router();

const { salesReportController } = require("../controllers");

Router.get("/sales-report", salesReportController.getSalesReport);

module.exports = Router;
