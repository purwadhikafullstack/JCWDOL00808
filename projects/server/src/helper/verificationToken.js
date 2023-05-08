const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createVerificationToken: (payload) => {
    //set jwt key on .env file
    return jwt.sign(payload, process.env.JWT_KEY);
  },

  validateVerificationToken: (token) => {
    //set jwt key on .env file
    return jwt.verify(token, process.env.JWT_KEY);
  },
};
