'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Vendas', 'produto_id', 'produto_nome');
    await queryInterface.renameColumn('Vendas', 'cliente_id', 'cliente_nome');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Vendas', 'produto_nome', 'produto_id');
    await queryInterface.renameColumn('Vendas', 'cliente_nome', 'cliente_id');
  }
};