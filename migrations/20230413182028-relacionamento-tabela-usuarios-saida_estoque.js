'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('saida_estoque', 'id_user', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios', // nome da tabela referenciada
        key: 'id' // nome da coluna chave primária referenciada
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('saida_estoque', 'id_user');
  }
};