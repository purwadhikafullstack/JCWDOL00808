// Import Sequelize
const { Sequelize } = require("../models");
const { Op } = require("sequelize");

// Import models
const db = require("../models/index");
const products = db.products;
const product_categories = db.product_categories;
const stocks = db.stocks;

module.exports = {
  getCategories: async (req, res) => {
    try {
      const allCategories = await product_categories.findAll({
        order: [["name", "asc"]],
        where: {
          is_deleted: 0,
        },
      });

      res.status(200).send({
        isError: false,
        message: "Get categories successful",
        data: allCategories,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        isError: false,
        message: error.message,
        data: null,
      });
    }
  },
  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;

      const product = await products.findOne({
        where: { id: productId, is_deleted: 0 },
        include: [
          {
            model: stocks,
            attributes: [],
            required: false,
          },
        ],
        attributes: [
          "id",
          "name",
          "description",
          "price",
          "weight",
          "imageUrl",
          [Sequelize.fn("SUM", Sequelize.col("stocks.stock")), "totalStock"],
          [
            Sequelize.literal("(SUM(stocks.stock) - products.booked_stock)"),
            "availableStock",
          ],
        ],
        group: ["products.id"],
      });

      res.status(200).send({
        isError: false,
        message: "Get product details success",
        data: product,
      });
    } catch (error) {
      console.log(error);
      res.status(404).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
  getAllProducts: async (req, res) => {
    try {
      const {
        color,
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        limit,
        offset,
      } = req.query;

      // Build the query object for Sequelize
      const query = {
        where: {},
        order: [],
        limit: limit ? parseInt(limit) : 12, // Set default limit to 12
        offset: offset ? parseInt(offset) : 0, // Set default offset to 0
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
                  stocks.products_id = products.id
                  AND stocks.is_deleted = 0
              )`),
              "totalStock",
            ],
            [
              Sequelize.literal(`(
          SELECT SUM(stock)
          FROM stocks
          WHERE
            stocks.products_id = products.id
            AND stocks.is_deleted = 0                    
        ) - products.booked_stock`),
              "availableStock",
            ],
          ],
        },
      };

      if (search || color) {
        query.where = {};
        if (search && color) {
          query.where[Op.and] = [
            { name: { [Op.like]: `%${search}%` } },
            { name: { [Op.like]: `%${color}%` } },
          ];
        } else if (search) {
          query.where.name = { [Op.like]: `%${search}%` };
        } else if (color) {
          query.where.name = { [Op.like]: `${color}%` };
        }
      }

      // Add category query
      if (category) {
        query.where.product_categories_id = category;
      }

      // Add filter query by price
      if (minPrice || maxPrice) {
        query.where.price = {};

        if (minPrice) {
          query.where.price[Op.gte] = parseInt(minPrice);
        }

        if (maxPrice) {
          query.where.price[Op.lte] = parseInt(maxPrice);
        }
      }

      // Add sorting function
      if (sortBy && sortOrder) {
        query.order.push([sortBy, sortOrder.toUpperCase()]);
      }

      // Execute the query
      const productsData = await products.findAndCountAll(query);

      res.status(200).send({
        isError: false,
        message: "Get all products data success",
        data: productsData,
      });
    } catch (error) {
      res.status(404).send({
        isError: false,
        message: error.message,
        data: null,
      });
    }
  },
};
