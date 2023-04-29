// const db = require("../../models/index");
// const OrdersModel = db.orders;
// const sequelize = require("../../models/index");

// // import sequelize
// const Models = require("../../models");

// module.exports = {
//   getOrderList: async (req, res) => {
//     const user_id = req.query.users_id;
//     try {
//       let data = await OrdersModel.findAll({ attributes: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d")], where: { user_id } });
//       res.status(200).send(data);
//     } catch (error) {
//       console.log(error);
//       res.status(500).send(error);
//     }
//   },
// };
