'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('saida_estoque', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.DATE
      },
      quantidade: {
        type: Sequelize.INTEGER
      },
      id_produto: {
        type: Sequelize.INTEGER,
        references: {
          model: 'produtos',
          key: 'id'
        }
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('saida_estoque');
  }
};
