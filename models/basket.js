"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Basket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Basket.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.FLOAT,
      image: DataTypes.TEXT("long"),
      images: DataTypes.JSON,
      includedItems: DataTypes.JSON,
      availableExtras: DataTypes.JSON,
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Basket",
    }
  );
  return Basket;
};
