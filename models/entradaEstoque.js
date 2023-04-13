'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EntradaEstoque extends Model {
    static associate(models) {
      EntradaEstoque.belongsTo(models.Produto, { foreignKey: 'id_produto' });
      EntradaEstoque.belongsTo(models.Fornecedor, { foreignKey: 'id_fornecedor' });
    }
  }

  EntradaEstoque.init({
    data: {
      type: DataTypes.DATE
    },
    quantidade: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'EntradaEstoque',
    timestamps: false,
    underscored: true
  });

  return EntradaEstoque;
};
