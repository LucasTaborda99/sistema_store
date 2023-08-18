// Compras - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Compras
const { Compras } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

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
      const { produto_id, preco_unitario, quantidade_comprada, desconto_recebido, fornecedor_id, total_compra} = req.body;
    
      // Verifica se o id do produto e a quantidade comprada foram informadas, acima de 0
      if (!produto_id || !quantidade_comprada) {
        return res.status(400).json({ message: 'É necessário fornecer o produto_id e quantidade_comprada' });
      }

      // Verifica se o produto existe
      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Cria a compra no banco de dados
      const compra = await Compras.create({
        produto_id,
        preco_unitario,
        quantidade_comprada,
        desconto_recebido,
        fornecedor_id,
        total_compra,
        custo_total: total_compra,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt
      });

      // Cria um registro na tabela ProdutoXFornecedor para associar o produto ao fornecedor
      await ProdutoXFornecedor.create({
        produto_id: produto_id,
        fornecedor_id: fornecedor_id,
      });

      // Atualize a quantidade do produto na tabela Produtos
      await Produto.update(
        { quantidade: produto.quantidade + quantidade_comprada },
        { where: { id: produto_id } }
      );

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