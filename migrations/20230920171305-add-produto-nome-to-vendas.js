'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendas', 'produto_nome', {
      type: Sequelize.STRING, // O tipo de dados depende do tipo de dado que você está armazenando
      allowNull: true, // Defina como true ou false, dependendo se é obrigatório ou não
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendas', 'produto_nome');
  },
};
