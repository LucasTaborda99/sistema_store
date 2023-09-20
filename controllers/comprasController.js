// Compras - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Compras
const { Compras } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando a model Produto
const { Fornecedor } = require('../models/index');

// Importando a model ProdutoXFornecedor
const { ProdutoXFornecedor } = require('../models/index');

// Importando o módulo comprasService.js que está localizada na pasta services
const { SequelizeComprasRepository } = require('../services/comprasService');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Registra a compra
async function registrarCompra (req, res) {
    try {

      const createdBy = res.locals.email;
      const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

      // Obtém os dados da compra a partir do corpo da requisição
      const { produto_nome, preco_unitario, quantidade_comprada, desconto_recebido, fornecedor_nome, total_compra} = req.body;
    
      // Verifica se o nome do produto e a quantidade comprada foram informadas, acima de 0
      if (!produto_nome || !quantidade_comprada) {
        return res.status(400).json({ message: 'É necessário fornecer o nome do produto e quantidade_comprada' });
      }

    // Verifica se o produto existe
    const produto = await Produto.findOne({
      where: {
        nome: produto_nome
      }
    });

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    console.log(produto_nome)

    // Verifica se o fornecedor existe
    const fornecedor = await Fornecedor.findOne({
      where: {
        nome: fornecedor_nome
      }
    });

    if (!fornecedor) {
      return res.status(404).json({ message: 'Fornecedor não encontrado' });
    }
    console.log(fornecedor_nome)

      // Cria a compra no banco de dados
      const compra = await Compras.create({
        produto_nome: produto.nome,
        preco_unitario,
        quantidade_comprada,
        desconto_recebido,
        fornecedor_nome: fornecedor_nome,
        total_compra,
        custo_total: total_compra,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt
      });

      return res.status(201).json({ message: 'Compra registrada com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar a compra' });
    }
}

// Visualiza Compra, ordenando pelo ID
async function getCompra(req, res) {
    try {
      // Cria uma instância da classe SequelizeComprasRepository
      const compraRepository = new SequelizeComprasRepository();
  
      // Chama o método findAllCompras da instância de compraRepository e aguarda sua conclusão
      const compras = await compraRepository.findAllCompras();
  
      return res.status(200).json(compras);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

module.exports = {
    registrarCompra,
    getCompra
}