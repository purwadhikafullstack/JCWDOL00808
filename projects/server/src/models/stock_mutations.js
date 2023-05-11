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
      this.belongsTo(models.warehouses, { foreignKey: "from_warehouse_id", as: "from_warehouse" });
      this.belongsTo(models.warehouses, { foreignKey: "to_warehouse_id", as: "to_warehouse" });
    }
  }
  stock_mutations.init(
    {
      from_warehouse_id: DataTypes.INTEGER,
      to_warehouse_id: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      mutation_type: DataTypes.STRING,
      approvedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "stock_mutations",
    }
  );
  return stock_mutations;
};
