"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class warehouses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.admins, { foreignKey: "admins_id" });
      this.hasMany(models.orders, { foreignKey: "warehouses_id" });
      this.hasMany(models.stocks, { foreignKey: "warehouses_id" });
      this.hasMany(models.stock_histories, { foreignKey: "warehouses_id" });
    }
  }
  warehouses.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      district: DataTypes.STRING,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "warehouses",
    }
  );
  return warehouses;
};
