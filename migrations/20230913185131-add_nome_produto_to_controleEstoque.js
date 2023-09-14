'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('controleEstoque', 'nome_produto', {
      type: Sequelize.STRING(250),
      allowNull: true,
      references: {
        model: 'produtos',
        key: 'nome', // Nome da coluna que será referenciada na tabela produto
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('controleEstoque', 'nome_produto');
  }
};