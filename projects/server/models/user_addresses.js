"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.orders, { foreignKey: "user_addresses_id" });
      this.belongsTo(models.users, { foreignKey: "users_id" });
    }
  }
  user_addresses.init(
    {
      address: DataTypes.STRING,
      province: DataTypes.STRING,
      city: DataTypes.STRING,
      district: DataTypes.STRING,
      postal_code: DataTypes.INTEGER,
      latitude: DataTypes.STRING,
      longitude: DataTypes.STRING,
      recipient: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      is_primary: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user_addresses",
    }
  );
  return user_addresses;
};
