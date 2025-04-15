"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Um pedido pertence a um usuário
      Order.belongsTo(models.User, { foreignKey: "userId" });

      // Um pedido tem muitos itens
      Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
    }
  }

  Order.init(
    {
      userId: DataTypes.INTEGER,
      total: DataTypes.FLOAT,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
