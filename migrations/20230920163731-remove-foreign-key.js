'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove a restrição de chave estrangeira
    await queryInterface.removeConstraint('Compras', 'Compras_fornecedor_id_foreign_idx');
  },

  down: async (queryInterface, Sequelize) => {
    // Adicione novamente a restrição de chave estrangeira, se necessário
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
};
