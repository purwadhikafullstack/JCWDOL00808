// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const admins = db.admins;

//import hashing
const { hashPassword, hashMatch } = require("../lib/hash");


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

  register: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      //step 1 ambil data dari client (body)
      let { username, email, password, recipient, phone_number, address, city, province, postal_code } = req.body;

      // step 2 validasi
      let findUsername = await admins.findOne({
        where: {
          username,
        },
      });

      if (findUsername)
        return res.status(404).send({
          isError: true,
          message: "Username is exist",
          data: null,
        });

      //step 3 insert data ke users
      let insertUsers = await users.create({ username, email, password: await hashPassword(password) }, { transaction: t });
      let users_id = insertUsers.dataValues.id;

      //step 4 insert data ke users_address (membutuhkan id user)
      await users_address.create({ recipient, phone_number, address, city, province, postal_code, users_id }, { transaction: t });

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
