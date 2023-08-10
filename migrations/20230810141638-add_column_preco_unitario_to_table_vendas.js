'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Vendas', 'preco_unitario', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Vendas',
        key: 'id',
      },
      // onUpdate: 'CASCADE',
      // onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vendas', 'preco_unitario');
  }
};
