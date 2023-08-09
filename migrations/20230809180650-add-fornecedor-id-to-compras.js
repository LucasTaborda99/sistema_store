'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Compras', 'fornecedor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Fornecedor',
        key: 'id',
      },
      // onUpdate: 'CASCADE',
      // onDelete: 'SET NULL',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Compras', 'fornecedor_id');
  }
};
