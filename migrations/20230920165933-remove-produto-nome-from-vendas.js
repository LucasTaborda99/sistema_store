'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendas', 'produto_nome');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendas', 'produto_nome', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'Produtos',
        key: 'nome',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
