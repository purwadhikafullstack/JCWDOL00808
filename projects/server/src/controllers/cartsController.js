// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const carts = db.carts;
const products = db.products;

module.exports = {
  getCartData: async (req, res) => {
    try {
      const users_id = req.dataDecode.id;

      //Get all carts data owned by specific user and merged with products data
      const cartsData = await carts.findAll({
        where: { users_id },
        include: [
          {
            model: products,
            attributes: [
              [sequelize.literal("`carts`.`id`"), "id"],
              [sequelize.literal("`carts`.`quantity`"), "quantity"],
              [sequelize.literal("`carts`.`createdAt`"), "createdAt"],
              [sequelize.literal("`carts`.`updatedAt`"), "updatedAt"],
              "id",
              "name",
              "description",
              "price",
              "weight",
              "imageUrl",
              "createdAt",
              "updatedAt",
              "product_categories_id",
            ],
            required: true,
          },
        ],
        attributes: [], // Add this line to exclude carts attributes
      });

      res.status(200).send({
        isError: false,
        message: "Get carts data success",
        data: cartsData,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  updateCartData: async (req, res) => {
    try {
      const users_id = req.dataDecode.id;
      const { id, quantity } = req.body;

      await carts.update({ quantity }, { where: { users_id, id } });

      res.status(200).send({
        isError: false,
        message: "Update cart data success",
        data: null,
      });
    } catch (error) {
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
