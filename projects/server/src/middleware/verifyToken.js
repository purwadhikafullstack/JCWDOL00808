const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");
const db = require("../models/index");
const admins = db.admins;
require("dotenv").config();

const verifyToken = (req, res, next) => {
  // Get token from headers with authorization as the key name, change accordingly
  const token = req.headers.authorization;
  console.log("token:", token);
  if (!token || token === "null")
    return res
      .status(401)
      .send({ error: true, message: "You must be logged in.", data: null });

  jwt.verify(token, process.env.JWT_KEY, (err, data) => {
    try {
      if (err) {
        return res.status(401).send({
          error: true,
          message: "You session has been expired.",
          data: null,
        });
      }
      //give name for req method after token decoded, change accordingly
      req.dataDecode = data;

      next();
    } catch (error) {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

const verifyRoleAdmin = async (req, res, next) => {
  // Get token from headers with authorization as the key name, change accordingly
  const token = req.headers.authorization;

  if (!token)
    return res
      .status(401)
      .send({ error: true, message: "You must be logged In.", data: null });

  // const token = token.split(" ")[1];

  try {
    const data = jwt.verify(token, process.env.JWT_KEY);

    req.dataDecode = data;

    const admin = await admins.findByPk(data.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if the admin has the super admin role (role = 1)
    if (admin.role !== 1) {
      return res.status(403).json({
        message: "Unauthorized, only super admin can request stock mutation",
      });
    }

    req.admin = admin;

    next();
  } catch (error) {
    if (
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.JsonWebTokenError
    ) {
      res.status(401).send({
        isError: true,
        message: "Your session has expired. Please Login again",
        data: null,
      });
    } else {
      res.status(500).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  }
};

module.exports = { verifyToken, verifyRoleAdmin };
