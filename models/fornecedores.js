'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Fornecedor extends Model {
    static associate(models) {
    }
  }

  Fornecedor.init({
    nome: {
      type: DataTypes.STRING
    },
    endereco: {
      type: DataTypes.STRING
    },
    telefone: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Fornecedor',
    timestamps: false,
    underscored: true
  });

  return Fornecedor;
};