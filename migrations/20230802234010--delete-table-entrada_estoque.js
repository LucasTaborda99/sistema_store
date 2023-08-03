'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('entrada_estoque')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable('entrada_estoque', {
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
      id_fornecedor: {
        type: Sequelize.INTEGER,
        references: {
          model: 'fornecedor',
          key: 'id'
        }
      }
    });
  }
}

