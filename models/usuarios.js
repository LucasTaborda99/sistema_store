'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
    }
  }
  
  Usuario.init({
    nome: {
      type: DataTypes.STRING
    },
    numero_contato: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    senha: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.STRING
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
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    updated_by: {
      allowNull: false,
      type: DataTypes.STRING
    },
    deleted_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW')
    },
    deleted_by: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    underscored: true
  });

  return Usuario;
};
