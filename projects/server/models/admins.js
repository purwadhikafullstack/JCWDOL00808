//import UUIDV4
const { UUIDV4 } = require("sequelize");
("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasOne(models.warehouses, { foreignKey: "admins_id" });
    }
  }
  admins.init(
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
        validate: {
          isEmail: { msg: "Invalid email" },
        },
        unique: {
          args: true,
          msg: "Email already exist",
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
      role: DataTypes.INTEGER,
      profile_picture: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "admins",
    }
  );
  return admins;
};
