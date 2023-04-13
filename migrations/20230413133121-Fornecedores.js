'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('fornecedor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(250)
      },
      endereco: {
        type: Sequelize.STRING(250)
      },
      telefone: {
        type: Sequelize.STRING(20)
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fornecedor');
  }
};
