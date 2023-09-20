'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Vendas', 'Vendas_preco_unitario_foreign_idx');
  },

  down: async (queryInterface, Sequelize) => {
    // Se necessário, você pode adicionar a chave estrangeira de volta aqui
    // Certifique-se de configurar os campos, tipo e referências corretos.
  },
};
