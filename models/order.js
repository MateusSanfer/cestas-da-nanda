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
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending'
      },
      deliveryAddress: DataTypes.JSON,
      deliveryDate: DataTypes.DATEONLY,
      deliveryPeriod: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  return Order;
};
