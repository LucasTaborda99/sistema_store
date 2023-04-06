'use strict';
const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
    }
  }
  Categoria.init({
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    },
    descricao: {
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    created_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updated_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    deleted_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    deleted_by: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    underscored: true,
  });

  return Categoria;
};