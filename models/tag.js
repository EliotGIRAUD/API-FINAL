const { Model } = require('sequelize');
const { DataTypes } = require('sequelize');

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: { type: DataTypes.STRING, allowNull: false },
  });

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Product, { through: 'ProductTag', as: 'products' });
  };

  return Tag;
};
