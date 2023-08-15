// controleEstoque - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model controleEstoque
const { ControleEstoque } = require('../models/index');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando o módulo controleEstoqueService.js que está localizada na pasta services
const { SequelizeControleEstoqueRepository } = require('../services/ControleEstoque');

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
      const { data, quantidade_minima, quantidade_maxima, quantidade_atual, produto_id } = req.body;

      // Verifica se o produto existe
      const produto = await Produto.findByPk(produto_id);
      if (!produto) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Cria o controle de estoque no banco de dados
      const controleEstoque = await ControleEstoque.create({
        data,
        quantidade_minima,
        quantidade_maxima,
        quantidade_atual,
        produto_id,
        created_by: createdBy,
        created_at: createdAt,
        data: createdAt
      });

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

module.exports = {
    registrarControleEstoque,
    getControleEstoque,
    getProdutosEstoqueBaixo
}