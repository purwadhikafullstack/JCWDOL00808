const { Op } = require("sequelize");
// const users = require("../../models/users");
// const User = require("../../models/users");
const db = require("../../models/index");
const user = db.users;

async function getUsers({ limit, offset, sortBy, order, search, filter }) {
  // Membuat objek options yang akan digunakan sebagai opsi kueri database
  const options = {
    limit,
    offset,
    order: [[sortBy, order]],
    where: {},
  };

  // Menambahkan opsi pencarian jika diberikan
  if (search) {
    options.where = {
      [Op.or]: [
        { id: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } },
        { phone_number: { [Op.like]: `%${search}%` } },
        { createdAt: { [Op.like]: `%${search}%` } },
        { updatedAt: { [Op.like]: `%${search}%` } },
      ],
    };
  }

  // Menambahkan opsi filter jika diberikan
  if (filter) {
    options.where.role = filter;
  }

  // Mengambil data pengguna dari database menggunakan Sequelize
  const users = await user.findAndCountAll(options);
  console.log(users);

  // Mengembalikan objek yang berisi data pengguna dan total pengguna
  return {
    users: users.rows,
    total_users: users.count,
  };
}

module.exports = {
  getUsers,
};
