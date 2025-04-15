"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Um usuário pode ter muitos pedidos
      User.hasMany(models.Order, { foreignKey: "userId" });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING, // hash da senha
      isAdmin: DataTypes.BOOLEAN, // identifica se o usuário é admin
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
