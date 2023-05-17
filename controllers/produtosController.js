// Produtos - Controller 

// Importando a model Produto
const Produto = require('../models').Produto;

// Importando a model Categoria
const Categoria = require('../models').Categoria

// Importando o m�dulo produtoService.js que est� localizada na pasta services
const { SequelizeProdutoRepository } = require('../services/ProdutoService');

const getConnection = require('../connection');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e hor�rios.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Cria Produto, funcionalidade dispon�vel apenas aos roles = 'admin'
async function adicionarProduto (req, res){
  try {
    const produto = req.body;
    const nome = produto.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');


    const foundProduto = await Produto.findOne({ where: { nome } });
    
    if (foundProduto) {
        return res.status(400).json({ message: "Produto j� existente" });
    }

    const foundCategoria = await Categoria.findOne({ where: { id: produto.id_categoria } });

    if (!foundCategoria) {
        return res.status(400).json({ message: "Categoria inv�lida" })
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
    // Cria uma inst�ncia da classe SequelizeProdutoRepository
    const produtoRepository = new SequelizeProdutoRepository();

    // Chama o m�todo findAllProdutos da inst�ncia de produtoRepository e aguarda sua conclus�o
    const produtos = await produtoRepository.findAllProdutos();

    return res.status(200).json(produtos);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// Atualiza Produto pelo ID, funcionalidade dispon�vel apenas aos roles = 'admin'
const updateProduto = async (req, res) => {
  
  const { id, nome } = req.body;
  const updatedBy = res.locals.email;
  const updatedAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

  try {
    // Busca o produto pelo ID
    const Produto = await Produto.findByPk(id);
    if (!Produto) {
      return res.status(404).json({ message: 'Produto com esse ID n�o encontrado' });
    }
    // Verifica se j� existe um produto com esse nome
    const ProdutoExistente = await Produto.findOne({ where: { nome } });
    if (ProdutoExistente && ProdutoExistente.id !== Produto.id) {
      return res.status(400).json({ message: 'J� existe um produto com esse nome' });
    }
    // Atualiza o produto
    await Produto.update({ nome, updated_by: updatedBy, updated_at: updatedAt});
    return res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar o produto' });
  }
};

// 'Deleta' produto ('softdelete', atualiza a coluna 'deleted_at' com a data e hor�rio que o produto foi deletado
// e atualiza a coluna deleted_by com o email do usu�rio que deletou), funcionalidade dispon�vel apenas aos roles = 'admin'
async function deleteProduto(req, res) {
  try {
      const produto = req.body;
      const deletedBy = res.locals.email;

      const query = "UPDATE produto SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";
      const connection = await getConnection();
      const [results] = await connection.query(query, [deletedBy, produto.id]);
      connection.release();

      if (results.affectedRows == 0) {
          return res.status(404).json({ message: "ID n�o encontrado" });
      }

      return res.status(200).json({ message: "Produto marcado como exclu�do com sucesso" });
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