// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const users = db.users;

module.exports = {
  isAuth: async (req, res) => {
    try {
      const { id } = req.dataDecode;
      const response = await users.findOne({
        where: { id },
        attributes: { exclude: ["password"] },
      });
      res.status(200).send({
        isError: false,
        message: "Get user data success",
        data: response,
      });
    } catch (error) {
      res.status(401).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
