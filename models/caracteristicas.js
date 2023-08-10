'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Caracteristicas extends Model {
    static associate(models) {
      Caracteristicas.belongsTo(models.Produto, { foreignKey: 'produto_id' });
    }
  }

  Caracteristicas.init({
    marca: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tamanho: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    composicao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'Caracteristicas',
    timestamps: false,
    underscored: true,
  });

  return Caracteristicas;
};
