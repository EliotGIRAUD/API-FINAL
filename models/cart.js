const { Model, DataTypes } = require('sequelize');


'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
    Cart.belongsToMany(models.Product, { through: 'CartProduct', as: 'products' });
  };

  return Cart;
};
