const { DataTypes } = require("sequelize");
const sequelize = require("../core/orm");
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    description: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  });

  Product.associate = (models) => {
    Product.belongsToMany(models.Tag, { through: 'ProductTag', as: 'tags' });
  };

  return Product;
};
