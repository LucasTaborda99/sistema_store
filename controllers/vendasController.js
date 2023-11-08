// Vendas - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Vendas
const { Vendas } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando a model Produto
const { Clientes } = require('../models/index');

// Importando a model Produto
const { ControleEstoque } = require('../models/index');

// Importando a função envioNotificacaoEstoqueBaixo do módulo notificacaoEstoqueController.js
const { envioNotificacaoEstoqueBaixo } = require('./notificacaoEstoqueController');

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
      const { produto_nome, preco_unitario, quantidade_vendida, desconto_aplicado, cliente_nome, total_venda} = req.body;
    
      // Verifica se o id do produto e a quantidade vendida foram informadas, acima de 0
      if (!produto_nome || !quantidade_vendida) {
        return res.status(400).json({ message: 'É necessário fornecer o nome do produto e a quantidade vendida' });
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

    // Verifica se o cliente existe
    const cliente = await Clientes.findOne({
      where: {
        nome: cliente_nome
      }
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    console.log(cliente_nome)

      // Verifica se a quantidade vendida é maior do que a disponível no estoque
      if (quantidade_vendida > produto.quantidade) {
        return res.status(400).json({ message: 'Quantidade insuficiente em estoque' });
      }

      // Cria a venda no banco de dados
      const venda = await Vendas.create({
        produto_nome: produto.nome,
        preco_unitario,
        quantidade_vendida,
        desconto_aplicado,
        total_venda,
        cliente_nome: cliente_nome,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt
      });

      // Atualize a quantidade do produto na tabela Produtos
      await Produto.update(
        { quantidade: produto.quantidade - quantidade_vendida },
        { where: { nome: produto_nome } }
      );

      // Atualize a quantidade do produto na tabela ControleEstoque
      await ControleEstoque.update(
        { quantidade_atual: produto.quantidade - quantidade_vendida },
        { where: { nome_produto: produto_nome } });

      // Buscando o registro da ControleEstoque com base no nome do produto
      const controleEstoque = await ControleEstoque.findOne({ where: { nome_produto: produto_nome } });

      // Verifica se a quantidade atual é menor ou igual à quantidade mínima
      if (controleEstoque && controleEstoque.quantidade_atual <= controleEstoque.quantidade_minima) {
        // Chama a função para enviar a notificação de estoque baixo
        console.log("Valor de userEmail:", createdBy);
        console.log("Valor de userEmail:", produto);
        
        await envioNotificacaoEstoqueBaixo(controleEstoque, createdBy);
    }

      return res.status(201).json({ message: 'Venda registrada com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar a venda' });
    }
}

// Visualiza Venda, ordenando pelo ID
async function getVenda(req, res) {
    try {
      // Cria uma instância da classe SequelizeVendaRepository
      const vendaRepository = new SequelizeVendasRepository();
  
      // Chama o método findAllVendas da instância de vendaRepository e aguarda sua conclusão
      const vendas = await vendaRepository.findAllVendas();
  
      return res.status(200).json(vendas);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

module.exports = {
    registrarVenda,
    getVenda
}