const { Model } = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: 'visitor' }, // "visitor", "client", "admin"
  });

  User.associate = (models) => {
    User.hasMany(models.Cart, { as: 'carts', foreignKey: 'userId' });
    User.hasMany(models.Order, { as: 'orders', foreignKey: 'userId' });
  };

  return User;
};
