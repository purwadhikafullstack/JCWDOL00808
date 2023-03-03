"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class stock_mutations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.products, { foreignKey: "products_id" });
    }
  }
  stock_mutations.init(
    {
      from_warehouse_id: DataTypes.INTEGER,
      to_warehouse_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      approvedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "stock_mutations",
    }
  );
  return stock_mutations;
};
