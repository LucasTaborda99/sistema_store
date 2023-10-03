// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importe o módulo Sequelize no início do arquivo
const Sequelize = require('sequelize');

require('dotenv').config()

// Importando o modelo de vendas
const { Vendas } = require('../models');

// Importando o modelo de compras
const { Compras } = require('../models');

  async function clienteMaisComprou(req, res) {
    try {
      const result = await Vendas.findAll({
        attributes: [
          'cliente_nome',
          [Sequelize.fn('COUNT', Sequelize.col('cliente_nome')), 'total_compras'],
        ],
        group: ['cliente_nome'],
        order: [[Sequelize.literal('total_compras'), 'DESC']],
        limit: 1,
      });

      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: 'Nenhum dado encontrado.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro ao processar a consulta.' });
    }
  }

  async function fornecedorMaisCompras(req, res) {
    try {
      const result = await Compras.findAll({
        attributes: [
          'fornecedor_nome',
          [Sequelize.fn('COUNT', Sequelize.col('fornecedor_nome')), 'total_vendas'],
        ],
        group: ['fornecedor_nome'],
        order: [[Sequelize.literal('total_vendas'), 'DESC']],
        limit: 1,
      });
  
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: 'Nenhum dado encontrado.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro ao processar a consulta.' });
    }
  }

  async function produtoMaisVendido(req, res) {
    try {
      const result = await Vendas.findAll({
        attributes: [
          'produto_nome',
          [Sequelize.fn('COUNT', Sequelize.col('produto_nome')), 'total_vendas'],
        ],
        group: ['produto_nome'],
        order: [[Sequelize.literal('total_vendas'), 'DESC']],
        limit: 1,
      });
  
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: 'Nenhum dado encontrado.' });
      }
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro ao processar a consulta.' });
    }
  }
  
  module.exports = {
    clienteMaisComprou,
    fornecedorMaisCompras,
    produtoMaisVendido
  };