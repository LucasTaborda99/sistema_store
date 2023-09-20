module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Vendas', 'produto_nome', {
      type: Sequelize.STRING, // Altere o tipo de dados para ser compatível com a coluna 'id' na tabela 'produtos'
      allowNull: false,
      references: {
        model: 'Produtos', // Nome da tabela de produtos
        key: 'nome', // Nome da coluna que você está referenciando na tabela de produtos
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Vendas', 'produto_nome');
  }
};