'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('Compras', 'total_compra', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('Compras', 'preco_medio_compra', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Compras', 'desconto_recebido', {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Compras', 'custo_total', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn('Compras', 'preco_unitario', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Compras', 'total_compra');
    await queryInterface.removeColumn('Compras', 'preco_medio_compra');
    await queryInterface.removeColumn('Compras', 'desconto_recebido');
    await queryInterface.removeColumn('Compras', 'custo_total');
    await queryInterface.removeColumn('Compras', 'preco_unitario');
  }
};