"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, { foreignKey: "users_id" });
      this.belongsTo(models.products, { foreignKey: "products_id" });
    }
  }
  carts.init(
    {
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};
