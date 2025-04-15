"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      // Cada item pertence a um pedido
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });

      // Cada item pertence a uma cesta
      OrderItem.belongsTo(models.Basket, { foreignKey: "basketId" });
    }
  }

  OrderItem.init(
    {
      orderId: DataTypes.INTEGER,
      basketId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      extras: DataTypes.JSON,
      subtotal: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );

  return OrderItem;
};
