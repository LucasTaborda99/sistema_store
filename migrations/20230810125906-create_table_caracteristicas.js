'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Caracteristicas', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tamanho: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      composicao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Produtos',
          key: 'id',
        },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Caracteristicas');
  },
};
