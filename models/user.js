const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require("../core/orm");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: 'visitor' }, // "visitor", "client", "admin"
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          user.password = await bcrypt.hash(user.password, 10); // Hacher le mot de passe avant création
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10); // Hacher le mot de passe si mis à jour
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Cart, { as: 'carts', foreignKey: 'userId' });
    User.hasMany(models.Order, { as: 'orders', foreignKey: 'userId' });
  };

  return User;
};
