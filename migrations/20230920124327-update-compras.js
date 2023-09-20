'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Compras', 'produto_id', 'produto_nome');
    await queryInterface.renameColumn('Compras', 'fornecedor_id', 'fornecedor_nome');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Compras', 'produto_nome', 'produto_id');
    await queryInterface.renameColumn('Compras', 'fornecedor_nome', 'fornecedor_id');
  }
};
