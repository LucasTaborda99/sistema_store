'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicione um índice à coluna nome na tabela produtos
    await queryInterface.addIndex('produtos', ['nome']);

    // Resto do código para criar a tabela produtos
    await queryInterface.createTable('produtos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      // ... outras colunas da tabela produtos ...
      created_at: {
        type: Sequelize.DATE,
      },
      created_by: {
        type: Sequelize.STRING
      },
      updated_at: {
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.STRING
      },
      deleted_at: {
        type: Sequelize.DATE
      },
      deleted_by: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('produtos');
  }
};