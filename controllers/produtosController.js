// Produtos - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando a model Categoria
const Categoria = require('../models').Categoria

// Importando o módulo produtoService.js que está localizada na pasta services
const { SequelizeProdutoRepository } = require('../services/ProdutoService');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

// Importando o módulo logger
const logger = require('../services/logger');

require('dotenv').config()

// Cria Produto, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarProduto (req, res){
  try {
    const produto = req.body;
    const nome = produto.nome;
     // Cliente fornece o nome da categoria
    const nomeCategoria = produto.nome_categoria;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    const foundProduto = await Produto.findOne({ where: { nome, deleted_by: null } });
    
    if (foundProduto) {
        logger.warn(`Tentativa de adicionar produto já existente: ${nome}`);
        return res.status(400).json({ message: "Produto já existente e não está marcado como deletado" });
    }

    // Procurando a categoria pelo nome fornecido pelo cliente
    const foundCategoria = await Categoria.findOne({ where: { nome: nomeCategoria } });

    if (!foundCategoria) {
        logger.warn(`Tentativa de adicionar produto com categoria inválida: ${produto.id_categoria}`);
        return res.status(400).json({ message: "Categoria inválida" })
    }

    // Validar se o preço é um número válido
    const preco = parseFloat(produto.preco);
    if (isNaN(preco) || preco <= 0) {
      return res.status(400).json({ message: "O preço deve ser um número válido maior que zero" });
    }

    // Validar se a quantidade é um número válido
    const quantidade = parseInt(produto.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      return res.status(400).json({ message: "A quantidade deve ser um número inteiro válido maior que zero" });
    }

    const newProduto = await Produto.create({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      created_by: createdBy,
      created_at: createdAt,
      id_categoria: foundCategoria.id,
      nome_categoria: foundCategoria.nome
    });

    logger.info(`Produto "${produto.nome}" foi adicionado por "${createdBy}"`);

    res.status(201).json({ message: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error(error);
      logger.error(`Erro ao criar produto: ${error.message}`);
      res.status(500).json({ message: 'Ocorreu um erro ao criar o produto' });
    }
}

// Visualiza Produto, ordenando pelo ID
async function getProduto(req, res) {
  try {
    // Cria uma instância da classe SequelizeProdutoRepository
    const produtoRepository = new SequelizeProdutoRepository();

    // Chama o método findAllProdutos da instância de produtoRepository e aguarda sua conclusão
    const produtos = await produtoRepository.findAllProdutos();

    return res.status(200).json(produtos);
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function updateProduto(req, res) {
  const produto = req.body
  const updatedBy = res.locals.email;
  // Cliente fornece o nome da categoria
  const nomeCategoria = produto.nome_categoria;
  const querySelect = 'SELECT id, nome, descricao, preco, quantidade, nome_categoria FROM produtos WHERE id = ?'
  const queryUpdate = 'UPDATE produtos set nome = ?, descricao = ?, preco = ?, quantidade = ?, nome_categoria = ?, updated_at = NOW(), updated_by = ? WHERE id = ?';
  let connection

  try {
      const db = Database.getInstance();
      connection = await db.getConnection();
      
       // Apenas um registro é esperado
      const [results] = await connection.query(querySelect, [produto.id]);

      if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: 'Produto não encontrado' })
      }

      // Procurando a categoria pelo nome fornecido pelo cliente
      const foundCategoria = await Categoria.findOne({ where: { nome: nomeCategoria } });

      if (!foundCategoria) {
          logger.warn(`Tentativa de adicionar produto com categoria inválida: ${produto.id_categoria}`);
          return res.status(400).json({ message: "Categoria inválida" })
      }

    // Validar se o preço é um número válido
    const preco = parseFloat(produto.preco);
    if (isNaN(preco) || preco <= 0) {
      connection.release();
      return res.status(400).json({ message: 'O preço deve ser um número válido maior que zero' });
    }

    // Validar se a quantidade é um número válido
    const quantidade = parseInt(produto.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      connection.release();
      return res.status(400).json({ message: 'A quantidade deve ser um número inteiro válido maior que zero' });
    }

      const [updateResult] = await connection.query(queryUpdate, [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.nome_categoria, updatedBy, produto.id]);

      if (updateResult.affectedRows === 0) {
          connection.release();
          logger.warn(`Tentativa de atualizar produto não encontrado. ID: ${produto.id}`);
          return res.status(404).json({ message: 'Nome do produto não encontrado' })
      }

      const produtoInstance = await Produto.findByPk(produto.id);
      await produtoInstance.updatePrecoValor(produto.preco);

      // Mensagem de log
      logger.info(`Produto com ID ${produto.id} foi atualizado por ${updatedBy} \n Produto após a atualização: ${JSON.stringify(produto)} \n Produto antes da atualização: ${JSON.stringify(results)}`);

      return res.status(200).json({ message: 'Produto atualizado com sucesso' })
  } catch (err) {
      console.error(err);
      return res.status(500).json(err)
  } finally {
      if(connection)
      connection.release();
  }
}

// 'Deleta' produto ('softdelete', atualiza a coluna 'deleted_at' com a data e horário que o produto foi deletado
// e atualiza a coluna deleted_by com o email do usuário que deletou), funcionalidade disponível apenas aos roles = 'admin'
async function deleteProduto(req, res) {
  try {
      const produto = req.body;
      const deletedBy = res.locals.email;

      const query = "UPDATE produtos SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";

      const db = Database.getInstance();
      const connection = await db.getConnection();

      const [results] = await connection.query(query, [deletedBy, produto.id]);
      connection.release();

      if (results.affectedRows == 0) {
          logger.warn(`Tentativa de exclusão de produto não encontrado. ID: ${produto.id}`);
          return res.status(404).json({ message: "ID não encontrado" });
      }

      logger.info(`Produto com ID ${produto.id} foi marcado como excluído por ${deletedBy}`);

      if (res.locals.role !== 'admin') {
        return res.status(401).json({ message: "Apenas administradores têm permissão para deletar produtos" });
      }

      return res.status(200).json({ message: "Produto marcado como excluído com sucesso" });
  } catch (err) {
      console.error(err);
      logger.error(`Erro ao deletar produto: ${err.message}`);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarProduto,
    getProduto,
    updateProduto,
    deleteProduto
}