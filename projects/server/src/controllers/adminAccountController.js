// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const users = db.users;
const admins = db.admins;

// Import verification token function
const { createVerificationToken } = require("../helper/verificationToken");
// Import transporter function
const transporter = require("../helper/transporter");
const fs = require("fs").promises;
const handlebars = require("handlebars");

module.exports = {
  getUser: async (req, res) => {
    try {
      // if (req.admins.role !== "1") {
      //   return res.status(403).json({ message: "Forbidden" });
      // }

      // Ambil semua data admin dari database
      const admin = await admins.findAll();
      res.json({ admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },
};
