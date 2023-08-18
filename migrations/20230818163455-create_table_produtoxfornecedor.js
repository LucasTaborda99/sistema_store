'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produtoxfornecedor', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'produtos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fornecedor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'fornecedor',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
        created_at: {
          type: Sequelize.DATE
        },
        created_by: {
          type: Sequelize.STRING
        },
        updated_at: {
          type: Sequelize.DATE
        },
        updated_by: {
          type: Sequelize.STRING
        },
        deleted_at: {
          type: Sequelize.DATE
        },
        deleted_by: {
          type: Sequelize.STRING
        }
      })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('produtoxfornecedor');
  }
};
