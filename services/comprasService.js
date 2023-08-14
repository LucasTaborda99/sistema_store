// comprasService.js

// Importando da model compras a classe Compras
const { Compras } = require('../models/index');

// Criando a classe ComprasRepository, servindo como uma interface
class ComprasRepository {
  async findAllCompras() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizeComprasRepository que estende a classe ComprasRepository
class SequelizeComprasRepository extends ComprasRepository {
  async findAllCompras() {

    // Buscando todos as compras, ordenando pelo id e onde a coluna 'deleted_at' for null
    return Compras.findAll({
      order: ['id'],
      where: { deleted_at: null }
    });
  }
}

module.exports = {
    SequelizeComprasRepository
};