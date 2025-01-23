const { Model } = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require("../core/orm");

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    total: { type: DataTypes.FLOAT },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Order.belongsToMany(models.Product, { through: 'OrderProduct', as: 'products' });
  };

  return Order;
};
