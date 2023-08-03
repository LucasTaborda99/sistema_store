'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Vendas', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      quantidade_vendida: {
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
        defaultValue: DataTypes.NOW,
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
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos', // Nome da tabela referenciada (pluralizada)
          key: 'id',
        },
        // onUpdate: 'CASCADE', // Define a ação para atualizações na tabela referenciada
        // onDelete: 'CASCADE', // Define a ação para atualizações na tabela referenciada
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Vendas');
  },
};

