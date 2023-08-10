'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('ControleEstoque', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id',
        },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ControleEstoque');
  },
};

