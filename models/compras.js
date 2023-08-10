'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compras extends Model {
    static associate(models) {
        Compras.belongsTo(models.Produto, { foreignKey: 'produto_id' });
        Compras.belongsTo(models.Fornecedor, { foreignKey: 'fornecedor_id' });
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
    fornecedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Fornecedor',
        key: 'id'
      }
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
    modelName: 'Compras',
    timestamps: false, // desabilita a criação das colunas created_at e updated_at
    underscored: true
  });

  return Compras;
};