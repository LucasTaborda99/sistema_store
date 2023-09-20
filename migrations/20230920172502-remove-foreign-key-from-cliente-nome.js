'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove a foreign key constraint
    await queryInterface.removeConstraint('vendas', 'Vendas_cliente_nome_foreign_idx');
  },

  down: async (queryInterface, Sequelize) => {
    // Recrie a foreign key constraint, se necessário
    await queryInterface.addConstraint('vendas', {
      fields: ['cliente_nome'],
      type: 'foreign key',
      name: 'Vendas_cliente_nome_foreign_idx',
      references: {
        table: 'clientes',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
};
