const db = require("../../models/index");
const orders = db.orders;
const order_details = db.order_details;
const carts = db.carts;
const products = db.products;
const stocks = db.stocks;
const sequelize = require("../../models/index");

// import sequelize
const Models = require("../../models");

module.exports = {
  test: async (req, res) => {
    try {
      let id = "e98f2256-40e7-4de5-a59a-dab1964c8a0d";
      //   let { id } = req.dataDecode;
      let { total_price, status, shipping_method, shipping_cost, user_addresses_id, warehouses_id } = req.body;

      //Get all carts data owned by specific user and merged with products data
      const fetchCart = await carts.findAll({
        where: {
          users_id: id,
        },
        include: [
          {
            model: products,
            as: "product",
            required: true,
            attributes: ["id", "name", "price", "weight", "imageUrl"],
          },
        ],
        attributes: ["id", "users_id", "quantity", "products_id"],
      });

      // cek apakah stok pesanan per product < stok produk secara keseluruhan
      let validationChecker = [];
      for (i = 0; i < fetchCart.length; i++) {
        let id = fetchCart[i].products_id;
        let quantity = fetchCart[i].quantity;
        let product_stock = await stocks.findAll({
          where: {
            products_id: id,
          },
          raw: true,
        });
        // console.log("product_stock", product_stock[0].stock);
        let stock = 0;
        for (j = 0; j < product_stock.length; j++) {
          stock += product_stock[j].stock;
        }
        if (quantity <= stock) {
          validationChecker.push(i);
        }
      }

      if (fetchCart.length == validationChecker.length) {

        const createNewOrder = await orders.create({
          total_price,
          status,
          shipping_method,
          shipping_cost,
          user_addresses_id,
          warehouses_id,
          users_id: id,
        });

        let findOrderId = await orders.findOne({ where: { users_id: id }, order: [["id", "DESC"]] });

        for (i = 0; i < fetchCart.length; i++) {
          let carts_id = fetchCart[i].id;

          let addOrderDetails = await order_details.create({
            orders_id: findOrderId.dataValues.id,
            products_id: fetchCart[i].product.id,
            product_name: fetchCart[i].product.name,
            quantity: fetchCart[i].quantity,
            product_price: fetchCart[i].product.price,
            product_weight: fetchCart[i].product.weight,
            imageUrl: fetchCart[i].product.imageUrl,
          });

          let deleteCartData = await carts.destroy({ where: { id: carts_id } });
        }
      }

      res.status(200).send({
        success: true,
        message: "Test ok",
        data: fetchCart,
        // log: findOrderId,
        // log: fetchCart[0].products_id
      });
    } catch (error) {
      console.log(error);
    }
  },
};
