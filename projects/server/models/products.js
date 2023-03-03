"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.carts, { foreignKey: "products_id" });
      this.hasMany(models.order_details, { foreignKey: "products_id" });
      this.belongsTo(models.product_categories, {
        foreignKey: "product_categories_id",
      });
      this.hasMany(models.stock_mutations, { foreignKey: "products_id" });
      this.hasMany(models.stock_histories, { foreignKey: "products_id" });
      this.hasMany(models.stocks, { foreignKey: "products_id" });
    }
  }
  products.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      weight: DataTypes.INTEGER,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "products",
    }
  );
  return products;
};
