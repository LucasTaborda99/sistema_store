'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('produtos', 'id_categoria', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categoria', // nome da tabela referenciada
        key: 'id' // nome da coluna chave primária referenciada
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('produtos', 'id_categoria');
  }
};