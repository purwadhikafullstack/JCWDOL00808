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
      quantity: {
        type: DataTypes.INTEGER,
        validate: { min: { args: 1, msg: "minimum quantity is 1" } },
      },
    },
    {
      sequelize,
      modelName: "carts",
    }
  );
  return carts;
};
