'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Altera o tipo de dado das colunas para STRING
    await queryInterface.changeColumn('Compras', 'produto_nome', {
      type: Sequelize.STRING,
    });
    await queryInterface.changeColumn('Compras', 'fornecedor_nome', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverte as alterações, se necessário
    await queryInterface.changeColumn('Compras', 'produto_nome', {
      type: Sequelize.INTEGER, // Reverter para o tipo original, se necessário
    });
    await queryInterface.changeColumn('Compras', 'fornecedor_nome', {
      type: Sequelize.INTEGER, // Reverter para o tipo original, se necessário
    });
  },
};
