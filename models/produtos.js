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
    modelName: 'Produto',
    timestamps: false, // desabilita a criação das colunas created_at e updated_at
    underscored: true
  });

  return Produto;
};
