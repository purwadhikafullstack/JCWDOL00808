const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  createToken: (payload) => {
    //set jwt key on .env file
    return jwt.sign(payload, process.env.JWT_KEY, {
      //set token expired (standard=ms, h=hours, m=minutes, d=days)
      expiresIn: "6h",
    });
  },

  validateToken: (token) => {
    //set jwt key on .env file
    return jwt.verify(token, process.env.JWT_KEY);
  },
};
