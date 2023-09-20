'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Compras', {
      fields: ['fornecedor_nome'],
      type: 'foreign key',
      name: 'nova_nome_da_constraint',
      references: {
        table: 'Fornecedores',
        field: 'nome',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove a nova restrição de chave estrangeira, se necessário
    await queryInterface.removeConstraint('Compras', 'nova_nome_da_constraint');
  },
};
