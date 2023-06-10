'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Categoria extends Model {
    static associate(models) {
    }
  }

  Categoria.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      allowNull: false,
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    created_by: {
      allowNull: true,
      type: DataTypes.STRING
    },
    updated_at: {
      type: DataTypes.DATE
    },
    updated_by: {
      type: DataTypes.STRING
    },
    deleted_at: {
      type: DataTypes.DATE
    },
    deleted_by: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Categoria',
    timestamps: false, // desabilita a criação das colunas created_at e updated_at
    underscored: true
  });

  return Categoria;
};