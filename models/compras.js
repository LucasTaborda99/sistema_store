'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Compras extends Model {
    static associate(models) {
        Compras.belongsTo(models.Produto, { foreignKey: 'produto_id' });
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