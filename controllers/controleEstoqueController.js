// controleEstoque - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model controleEstoque
const { ControleEstoque } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando o módulo controleEstoqueService.js que está localizada na pasta services
const { SequelizeControleEstoqueRepository } = require('../services/ControleEstoque');

// Importando a função envioNotificacaoEstoqueBaixo do módulo notificacaoEstoqueController.js
const { envioNotificacaoEstoqueBaixo } = require('./notificacaoEstoqueController');

const Sequelize = require('sequelize');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Registra o controle de estoque
async function registrarControleEstoque (req, res) {
    try {

      const createdBy = res.locals.email;
      const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

      // Obtém os dados do controle de estoque a partir do corpo da requisição
      const { quantidade_minima, quantidade_maxima, id, produto_id } = req.body;

      // Verifica se o produto existe
      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }

      // Verifica se o controle_id já existe na tabela
      const controleExistente = await ControleEstoque.findOne({
        where: {
          id
        }
      });

      if (controleExistente) {
        return res.status(400).json({ message: 'Já existe um controle com esse ID' });
      }

      // Usando o valor da quantidade_atual do produto
      const quantidade_atual = produto.quantidade;
      
      // Cria o controle de estoque no banco de dados
      const controleEstoque = await ControleEstoque.create({
        quantidade_minima,
        quantidade_maxima,
        quantidade_atual,
        produto_id,
        id,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt
      });

      // Verifica se a quantidade atual é menor ou igual à quantidade mínima
      if (quantidade_atual <= quantidade_minima) {
        // Chama a função para enviar a notificação de estoque baixo
        await envioNotificacaoEstoqueBaixo(produto);
      }

      return res.status(201).json({ message: 'Controle estoque com sucesso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao registrar o controle de estoque' });
    }
}

// Visualiza o controle de estoque, ordenando pelo ID
async function getControleEstoque(req, res) {
    try {
      // Cria uma instância da classe SequelizeControleEstoqueRepository
      const controleEstoqueRepository = new SequelizeControleEstoqueRepository();
  
      // Chama o método findAllControleEstoque da instância de controleEstoqueRepository e aguarda sua conclusão
      const controleEstoque = await controleEstoqueRepository.findAllControleEstoque();
  
      return res.status(200).json(controleEstoque);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async function getProdutosEstoqueBaixo(req, res) {
    try {
      const produtosComEstoqueBaixo = await ControleEstoque.findAll({
        where: {
          quantidade_atual: {
            // Biblioteca do Sequelize: Sequelize.Op, lte -> less than or equal,
            // ou seja, quantidade_atual <= quantidade_minima
            [Sequelize.Op.lte]: Sequelize.col('quantidade_minima')
          }
        },
        include: [Produto]
      });
  
      console.log('Produtos com estoque baixo:', produtosComEstoqueBaixo);

    // Transformando o resultado em um array de objetos
    const produtosArray = produtosComEstoqueBaixo.map(item => item.dataValues);
     
    return produtosArray;
    //return res.status(200).json(produtosArray);

    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar produtos com estoque baixo');
    }
  }

  // ... (código anterior)

// Atualiza o controle de estoque
async function atualizarControleEstoque(req, res) {
  try {

      const createdBy = res.locals.email;
      const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
      const { quantidade_minima, quantidade_maxima, id, produto_id } = req.body;

      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
          return res.status(404).json({ message: 'Produto não encontrado' });
      }

      // Usando o valor da quantidade_atual do produto
      const quantidade_atual = produto.quantidade;

      await ControleEstoque.update(
          {
            quantidade_minima,
            quantidade_maxima,
            quantidade_atual,
            produto_id,
            id,
            created_by: createdBy,
            created_at: createdAt,
            data: createdAt
          },
          {
              where: { id: id }
          }
      );

      // Verifica se a quantidade atual é menor ou igual à quantidade mínima
      if (quantidade_atual <= quantidade_minima) {
          // Chama a função para enviar a notificação de estoque baixo
          await envioNotificacaoEstoqueBaixo(produto);
      }

      return res.status(200).json({ message: 'Controle estoque atualizado com sucesso' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar o controle de estoque' });
  }
}

module.exports = {
    registrarControleEstoque,
    getControleEstoque,
    getProdutosEstoqueBaixo,
    atualizarControleEstoque
}