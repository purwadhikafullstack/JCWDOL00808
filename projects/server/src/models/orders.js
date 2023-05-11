"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.order_details, { foreignKey: "orders_id" });
      this.belongsTo(models.users, { foreignKey: "users_id" });
      this.belongsTo(models.user_addresses, {
        foreignKey: "user_addresses_id",
      });
      this.belongsTo(models.warehouses, { foreignKey: "warehouses_id" });
    }
  }
  orders.init(
    {
      total_price: DataTypes.INTEGER,
      status: DataTypes.STRING,
      payment_proof: DataTypes.STRING,
      shipping_method: DataTypes.STRING,
      shipping_cost: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orders",
    }
  );
  return orders;
};
