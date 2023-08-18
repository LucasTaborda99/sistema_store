'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Produto extends Model {
    static associate(models) {
      Produto.belongsTo(models.Categoria, { foreignKey: 'id_categoria' });
      Produto.hasMany(models.Precos, { foreignKey: 'produto_id', as: 'precos' });
    }

    // const Precos = require('./precos')

    static async updatePrecoValor(precoNovo) {

      try {
        const latestPreco = await this.getPrecos({
          order: [['data', 'DESC']],
        });
    
        if (latestPreco && latestPreco.length > 0) {
          await latestPreco[0].update({ valor: precoNovo });
          return latestPreco[0];
        }
    
        return null;
      } catch (error) {
        console.error('Erro ao atualizar o preço na tabela de preços:', error);
        throw error;
      }
    }
      
  }

  // Atribua a função à classe Produto
  Produto.prototype.updatePrecoValor = Produto.updatePrecoValor;

  Produto.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING(250),
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'categorias',
          key: 'id',
        },
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW'),
      },
      created_by: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      updated_by: {
        type: DataTypes.STRING,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
      deleted_by: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize, // instância do Sequelize
      modelName: 'Produto',
      timestamps: false, // desabilita a criação das colunas created_at e updated_at
      underscored: true,
    }
  );

  return Produto;

}
