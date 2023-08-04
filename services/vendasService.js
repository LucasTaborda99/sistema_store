// vendasService.js

// Importando da model vendas a classe Vendas
const { Vendas } = require('../models/index');

// Criando a classe VendasRepository, servindo como uma interface
class VendasRepository {
  async findAllVendas() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizeVendasRepository que estende a classe VendasRepository
class SequelizeVendasRepository extends VendasRepository {
  async findAllVendas() {

    // Buscando todos as vendas, ordenando pelo id e onde a coluna 'deleted_at' for null
    return Vendas.findAll({
      order: ['id'],
      where: { deleted_at: null }
    });
  }
}

module.exports = {
    SequelizeVendasRepository
};