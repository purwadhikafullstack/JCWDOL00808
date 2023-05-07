// Import Sequelize
const { sequelize } = require("../../models");

// Import models
const db = require("../../models/index");
const carts = db.carts;
const products = db.products;
const stocks = db.stocks;
const orders = db.orders;
const order_details = db.order_details;

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
            where: { is_deleted: 0 },
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
                  sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                      AND stocks.is_deleted = 0
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
            quantity: sequelize.literal(`quantity + ${quantity}`),
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
            where: { is_deleted: 0 },
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
                  sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                      AND stocks.is_deleted = 0
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
            where: { is_deleted: 0 },
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
                  sequelize.literal(`(
                    SELECT SUM(stock)
                    FROM stocks
                    WHERE
                      stocks.products_id = carts.products_id
                      AND stocks.is_deleted = 0
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
  deliverOrder: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      //Get order data
      const findOrder = await orders.findByPk(id);

      //Get all products_id from the orders
      const findOrderDetails = await order_details
        .findAll({
          attributes: ["products_id"],
          where: { orders_id: id },
        })
        .then((products) => {
          const productIds = products.map((product) => product.products_id);
          stocks
            .findAll({
              where: {
                warehouses_id: findOrder.dataValues.warehouses_id,
                products_id: productIds,
              },
            })
            .then(async (stocks) => {
              // Check if any products have no data
              const foundIds = stocks.map((stock) => stock.products_id);
              const missingIds = productIds.filter(
                (id) => !foundIds.includes(id)
              );
              if (missingIds.length > 0) {
                res.status(404).send({
                  isError: true,
                  message: `Stock for products ID ${missingIds.join(
                    ", "
                  )} is not available.`,
                  data: null,
                });
              } else {
                await orders.update(
                  { status: "Shipped" },
                  { where: { id } },
                  { transaction: t }
                );
                t.commit();

                // Create the MySQL event to update the order status after 7 days
                //     await sequelize.query(`
                //   CREATE EVENT update_order_status_${id}
                //   ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 7 DAY
                //   DO
                //     UPDATE orders SET status = 'Order confirmed' WHERE id = ${id};
                // `);

                res.status(200).send({
                  isError: false,
                  message: "Orders has been shipped",
                  data: null,
                });
              }
            });
        });
    } catch (error) {
      t.rollback();
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
