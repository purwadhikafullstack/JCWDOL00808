const bcrypt = require("bcrypt");
const saltRounds = 10;

// hashPassword function to hash received password
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    return null;
  }
};

// hashMatch function to check received password if matched as in database
const hashMatch = async (passwordFromLogin, hashedPasswordFromDatabase) => {
  try {
    let match = await bcrypt.compare(
      passwordFromLogin,
      hashedPasswordFromDatabase
    );
    return match;
  } catch (error) {
    return false;
  }
};

module.exports = {
  hashPassword,
  hashMatch,
};
