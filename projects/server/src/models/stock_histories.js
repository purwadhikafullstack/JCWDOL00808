"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock_histories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.hasOne(models.products, { foreignKey: "products_id", as: "products" });
      this.belongsTo(models.products, { foreignKey: "products_id" });
      // this.hasOne(models.warehouses, { foreignKey: "warehouses_id", as: "warehouses" });
      this.belongsTo(models.warehouses, { foreignKey: "warehouses_id" });
    }
  }
  stock_histories.init(
    {
      stock_before: DataTypes.INTEGER,
      stock_after: DataTypes.INTEGER,
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "stock_histories",
    }
  );
  return stock_histories;
};
