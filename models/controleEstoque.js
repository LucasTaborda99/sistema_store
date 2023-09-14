'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ControleEstoque extends Model {
    static associate(models) {
      ControleEstoque.belongsTo(models.Produto, { foreignKey: 'produto_id' });
    }
  }

  ControleEstoque.init({
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantidade_minima: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade_maxima: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade_atual: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome_produto: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },  
  }, {
    sequelize,
    modelName: 'ControleEstoque',
    tableName: 'controleEstoque',
    timestamps: false,
    underscored: true,
  });

  return ControleEstoque;
};