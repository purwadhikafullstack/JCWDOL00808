// const db = require("../../models/index");
// const users = db.users;
// const admins = db.admins;
// const warehouses = db.warehouses;

// const { sequelize } = require("../../models");
// // const { where } = require("sequelize");

// module.exports = {
//   editWarehouse: async (req, res) => {
//     // console.log("req.files: ", req.files);
//     console.log("req.body: ", req.body);
//     console.log("req.decript: ", req.decript);

//     try {
//       const { name, address, province, city, district, latitude, longitude, admins_id } = JSON.parse(req.body.data);
//       const warehouse = await warehouses.findByPk(req.decript.id);

//       if (!warehouse) {
//         return res.status(500).send({ success: false, message: "Warehouse not found!" });
//       }

//       warehouse.name = name;
//       warehouse.address = address;
//       warehouse.province = province;
//       warehouse.city = city;
//       warehouse.district = district;
//       warehouse.latitude = latitude;
//       warehouse.longitude = longitude;
//       warehouse.admins_id = admins_id;

//       await warehouses.save();

//       return res.status(200).send({ success: true, message: "Edit data warehouse success!" });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send(error);
//     }
//   },
// };
