// Vendas - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Vendas
const { Vendas } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando o módulo vendasService.js que está localizada na pasta services
const { SequelizeVendasRepository } = require('../services/vendasService');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Registra a venda
async function registrarVenda (req, res) {
    try {

      const createdBy = res.locals.email;
      const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

      // Obtém os dados da venda a partir do corpo da requisição
      const { produto_id, quantidade_vendida } = req.body;
    
      // Verifica se o id do produto e a quantidade vendida foram informadas, acima de 0
      if (!produto_id || !quantidade_vendida) {
        return res.status(400).json({ message: 'É necessário fornecer o produto_id e quantidade_vendida' });
      }

      // Verifica se o produto existe
      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      // Verifica se a quantidade vendida é maior do que a disponível no estoque
      if (quantidade_vendida > produto.quantidade) {
        return res.status(400).json({ message: 'Quantidade insuficiente em estoque' });
      }

      // Crie a venda no banco de dados
      const venda = await Vendas.create({
        produto_id,
        quantidade_vendida,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt,
      });

      // Atualize a quantidade do produto na tabela Produtos
      await Produto.update(
        { quantidade: produto.quantidade - quantidade_vendida },
        { where: { id: produto_id } }
      );

      return res.status(201).json(venda);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar a venda' });
    }
}

module.exports = {
    registrarVenda
}