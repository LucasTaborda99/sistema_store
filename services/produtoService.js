// produtoService.js

// Importando da model produtos a classe Produto
const { Produto } = require('../models/index');

// Criando a classe ProdutoRepository, servindo como uma interface
class ProdutoRepository {
  async findAllProdutos() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizeProdutoRepository que estende a classe ProdutoRepository
class SequelizeProdutoRepository extends ProdutoRepository {
  async findAllProdutos() {

    // Buscando todos os produtos, ordenando pelo id e onde a coluna 'deleted_at' for null
    return Produto.findAll({
      order: ['id'],
      where: { deleted_at: null }
    });
  }
}

module.exports = {
  SequelizeProdutoRepository
};
