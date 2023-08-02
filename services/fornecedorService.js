// fornecedorService.js

// Importando da model fornecedor a classe Produto
const { Fornecedor } = require('../models/index');

// Criando a classe FornecedorRepository, servindo como uma interface
class FornecedorRepository {
  async findAllFornecedores() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizeFornecedorRepository que estende a classe FornecedorRepository
class SequelizeFornecedorRepository extends FornecedorRepository {
  async findAllFornecedores() {

    // Buscando todos os fornecedor, ordenando pelo id e onde a coluna 'deleted_at' for null
    return Fornecedor.findAll({
      order: ['id'],
      where: { deleted_at: null }
    });
  }
}

module.exports = {
  SequelizeFornecedorRepository
};