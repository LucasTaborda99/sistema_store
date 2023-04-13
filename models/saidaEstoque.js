'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SaidaEstoque extends Model {
    static associate(models) {
      SaidaEstoque.belongsTo(models.Produto, { foreignKey: 'id_produto' });
      SaidaEstoque.belongsTo(models.User, { foreignKey: 'id_user' });
    }
  }

  SaidaEstoque.init({
    data: {
      type: DataTypes.DATE
    },
    quantidade: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'SaidaEstoque',
    timestamps: false,
    underscored: true
  });

  return SaidaEstoque;
};