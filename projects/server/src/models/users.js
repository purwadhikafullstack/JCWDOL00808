//import UUIDV4
const { UUIDV4 } = require("sequelize");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.carts, { foreignKey: "users_id" });
      this.hasMany(models.orders, { foreignKey: "users_id" });
      this.hasMany(models.user_addresses, { foreignKey: "users_id" });
    }
  }
  users.init(
    //Change id to UUID
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      //Constraint email format and set unique
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      //set default value as false
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone_number: DataTypes.STRING,
      role: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "users",
    }
  );
  return users;
};
