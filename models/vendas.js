'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vendas extends Model {
    static associate(models) {
      Vendas.belongsTo(models.Produto, { foreignKey: 'produto_nome' });
      Vendas.belongsTo(models.Clientes, { foreignKey: 'cliente_nome' });
    }
  }
  
  Vendas.init({
    quantidade_vendida: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      data: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_venda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      preco_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      preco_medio_venda: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      desconto_aplicado: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      lucro: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      produto_nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cliente_nome: {
        type: DataTypes.STRING,
        allowNull: false,
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
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Vendas',
    timestamps: false, // desabilita a criação das colunas created_at e updated_at
    underscored: true
  });

  return Vendas;
};