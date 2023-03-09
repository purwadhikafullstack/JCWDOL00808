// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const admins = db.admins;

//import hashing
const { hashPassword, hashMatch } = require("../lib/hash");

module.exports = {
  getUserAdmin: async (req, res) => {
    try {
      // Ambil semua data admin dari database
      const admin = await admins.findAll();
      res.json({ admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Terjadi kesalahan saat mengambil data." });
    }
  },

  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      //step 1 ambil data dari client (body)
      let { email, password, full_name, is_verified, phone_number, role } = req.body;
      let profile_picture = req.files.profile_picture[0].path;

      // step 2 validasi
      let findEmail = await admins.findOne({
        where: {
          email,
        },
      });

      if (findEmail)
        return res.status(404).send({
          isError: true,
          message: "email is exist",
          data: null,
        });

      //step 3 insert data ke users
      await admins.create({ email, password: await hashPassword(password), full_name, is_verified, phone_number, role, profile_picture }, { transaction: t });

      //step 5 kirim response
      await t.commit();
      res.status(201).send({
        isError: false,
        message: "register success",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
