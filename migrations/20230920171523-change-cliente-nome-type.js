'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Vendas', 'cliente_nome', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Vendas', 'cliente_nome', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
