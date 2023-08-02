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
    },
    cnpj: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    created_by: {
      allowNull: false,
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
    modelName: 'Fornecedor',
    tableName: 'Fornecedor',
    timestamps: false,
    underscored: true
  });

  return Fornecedor;
};