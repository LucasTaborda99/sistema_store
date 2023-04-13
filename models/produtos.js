'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Produto extends Model {
    static associate(models) {
      // Associações com outras tabelas, se necessário
      Produto.belongsTo(models.Categoria, { foreignKey: 'id_categoria' });
    }
  }

  Produto.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Produto',
    tableName: 'produtos'
  });

  return Produto;
};
