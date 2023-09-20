'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Vendas', 'Vendas_produto_nome_foreign_idx');
  },

  down: async (queryInterface, Sequelize) => {
    // Nenhuma ação é necessária para desfazer a remoção da restrição de chave estrangeira
  }
};
