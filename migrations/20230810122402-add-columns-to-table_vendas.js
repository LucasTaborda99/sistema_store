'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Vendas', 'total_venda', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('Vendas', 'preco_medio_venda', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Vendas', 'desconto_aplicado', {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Vendas', 'lucro', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Vendas', 'total_venda');
    await queryInterface.removeColumn('Vendas', 'preco_medio_venda');
    await queryInterface.removeColumn('Vendas', 'desconto_aplicado');
    await queryInterface.removeColumn('Vendas', 'lucro');
  }
};