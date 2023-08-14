// controleEstoqueService.js

// Importando da model ControleEstoque a classe ControleEstoque
const { ControleEstoque } = require('../models/index');

// Criando a classe controleEstoqueRepository, servindo como uma interface
class controleEstoqueRepository {
  async findAllControleEstoque() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizecontroleEstoqueRepository que estende a classe controleEstoqueRepository
class SequelizeControleEstoqueRepository extends controleEstoqueRepository {
  async findAllControleEstoque() {

    // Buscando todos os controle de estoque, ordenando pelo id e onde a coluna 'deleted_at' for null
    return ControleEstoque.findAll({
      order: ['id']
      // where: { deleted_at: null }
    });
  }
}

module.exports = {
    SequelizeControleEstoqueRepository
};