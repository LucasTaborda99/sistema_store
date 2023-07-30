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

require('dotenv').config()

// Cria Produto, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarProduto (req, res){
  try {
    const produto = req.body;
    const nome = produto.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    const foundProduto = await Produto.findOne({ where: { nome, deleted_by: null } });
    
    if (foundProduto) {
        return res.status(400).json({ message: "Produto já existente e não está marcado como deletado" });
    }

    const foundCategoria = await Categoria.findOne({ where: { id: produto.id_categoria } });

    if (!foundCategoria) {
        return res.status(400).json({ message: "Categoria inválida" })
    }

    const newProduto = await Produto.create({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      created_by: createdBy,
      created_at: createdAt,
      id_categoria: produto.id_categoria
    });

    res.status(201).json({ message: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error(error);
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
  const querySelect = 'SELECT nome FROM produtos WHERE id = ?'
  const queryUpdate = 'UPDATE produtos set nome = ?, descricao = ?, preco = ?, quantidade = ?, id_categoria = ?, updated_at = NOW(), updated_by = ? WHERE id = ?';
  let connection

  try {
      const db = Database.getInstance();
      connection = await db.getConnection();

      const [results] = await connection.query(querySelect, [produto.id]);

      if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: 'Produto não encontrado' })
      }

      const [updateResult] = await connection.query(queryUpdate, [produto.nome, produto.descricao, produto.preco, produto.quantidade, produto.id_categoria, updatedBy, produto.id]);

      if (updateResult.affectedRows === 0) {
          connection.release();
          return res.status(404).json({ message: 'Nome do produto não encontrado' })
      }

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
          return res.status(404).json({ message: "ID não encontrado" });
      }

      if (res.locals.role !== 'admin') {
        return res.status(401).json({ message: "Apenas administradores têm permissão para deletar produtos" });
      }

      return res.status(200).json({ message: "Produto marcado como excluído com sucesso" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarProduto,
    getProduto,
    updateProduto,
    deleteProduto
}