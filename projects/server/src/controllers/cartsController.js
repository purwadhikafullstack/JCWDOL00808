// Import Sequelize
const { Sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const carts = db.carts;
const products = db.products;
const stocks = db.stocks;

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
            include: [
              {
                model: stocks,
                attributes: [],
                required: true,
              },
            ],
            //Add total stock from all the warehouse
            attributes: {
              include: [
                [
                  Sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                  )`),
                  "totalStock",
                ],
              ],
            },
          },
        ],

        // include: [
        //   {
        //     model: products,
        //     attributes: [
        //       [sequelize.literal("`carts`.`id`"), "id"],
        //       [sequelize.literal("`carts`.`quantity`"), "quantity"],
        //       [sequelize.literal("`carts`.`createdAt`"), "createdAt"],
        //       [sequelize.literal("`carts`.`updatedAt`"), "updatedAt"],
        //       "id",
        //       "name",
        //       "description",
        //       "price",
        //       "weight",
        //       "imageUrl",
        //       "createdAt",
        //       "updatedAt",
        //       "product_categories_id",
        //     ],
        //     required: true,
        //   },
        // ],
        // attributes: [], // Add this line to exclude carts attributes
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
  addProduct: async (req, res) => {
    try {
      const users_id = req.dataDecode.id;
      const { products_id, quantity } = req.body;

      const findProduct = await carts.findOne({
        where: { users_id, products_id },
      });

      if (findProduct) {
        await carts.update(
          {
            quantity: Sequelize.literal(`quantity + ${quantity}`),
          },
          { where: { id: findProduct.dataValues.id } }
        );
      } else {
        await carts.create({ quantity, users_id, products_id });
      }

      const cartsData = await carts.findAll({
        where: { users_id },
        include: [
          {
            model: products,
            include: [
              {
                model: stocks,
                attributes: [],
                required: true,
              },
            ],
            //Add total stock from all the warehouse
            attributes: {
              include: [
                [
                  Sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                  )`),
                  "totalStock",
                ],
              ],
            },
          },
        ],
      });

      res.status(201).send({
        isError: false,
        message: "Add product success",
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

      const cartsData = await carts.findAll({
        where: { users_id },
        include: [
          {
            model: products,
            include: [
              {
                model: stocks,
                attributes: [],
                required: true,
              },
            ],
            //Add total stock from all the warehouse
            attributes: {
              include: [
                [
                  Sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                  )`),
                  "totalStock",
                ],
              ],
            },
          },
        ],
      });

      res.status(200).send({
        isError: false,
        message: "Update cart data success",
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
  deleteCartData: async (req, res) => {
    try {
      const users_id = req.dataDecode.id;
      const { id } = req.params;

      await carts.destroy({ where: { users_id, id } });

      const cartsData = await carts.findAll({
        where: { users_id },
        include: [
          {
            model: products,
          },
        ],
      });

      res.status(200).send({
        isError: false,
        message: "Product deleted",
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
};
