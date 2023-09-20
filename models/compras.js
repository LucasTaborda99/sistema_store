'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Compras extends Model {
    static associate(models) {
      Compras.belongsTo(models.Produto, { foreignKey: 'produto_nome', as: 'produto' });
      Compras.belongsTo(models.Fornecedor, { foreignKey: 'fornecedor_nome', as: 'fornecedor' });
    }

    get produto_nome() {
      return this.getDataValue('produto.nome');
    }

    get fornecedor_nome() {
      return this.getDataValue('fornecedor.nome');
    }

  }

  Compras.init({
    quantidade_comprada: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    preco_medio_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    total_compra: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    desconto_recebido: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    custo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    produto_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fornecedor_nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
    },
    created_by: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
    updated_by: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
    deleted_by: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Compras',
    timestamps: false, // Desabilita a criação das colunas created_at e updated_at
    underscored: true,
  });

  return Compras;
};
