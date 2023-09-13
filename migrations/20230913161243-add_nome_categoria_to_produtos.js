'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('produtos', 'nome_categoria', {
      type: Sequelize.STRING(250),
      allowNull: true,
      references: {
        model: 'categoria',
        key: 'nome', // Nome da coluna que será referenciada na tabela categoria
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('produtos', 'nome_categoria');
  }
};
