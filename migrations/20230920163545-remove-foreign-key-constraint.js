'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove a restrição de chave estrangeira
    await queryInterface.removeConstraint('Compras', 'compras_ibfk_1');
  },

  down: async (queryInterface, Sequelize) => {
    // Adicione novamente a restrição de chave estrangeira, se necessário
    await queryInterface.addConstraint('Compras', {
      fields: ['produto_nome'],
      type: 'foreign key',
      name: 'compras_ibfk_1',
      references: {
        table: 'Produtos', // Nome da tabela referenciada
        field: 'nome',    // Nome da coluna referenciada
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Adicione novamente a restrição de chave estrangeira, se necessário
    await queryInterface.addConstraint('Compras', {
      fields: ['fornecedor_nome'],
      type: 'foreign key',
      name: 'compras_ibfk_2',
      references: {
        table: 'Fornecedores', // Nome da tabela referenciada
        field: 'nome',         // Nome da coluna referenciada
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
};
