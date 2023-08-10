// clientesService.js

// Importando da model Clientes a classe Clientes
const { Clientes } = require('../models/index');

// Criando a classe ClientesRepository, servindo como uma interface
class ClientesRepository {
  async findAllClientes() {
    throw new Error('Método não implementado');
  }
}

// Criando a classe SequelizeClientesRepository que estende a classe ClientesRepository
class SequelizeClientesRepository extends ClientesRepository {
  async findAllClientes() {

    // Buscando todos os clientes, ordenando pelo id e onde a coluna 'deleted_at' for null
    return Clientes.findAll({
      order: ['id'],
      where: { deleted_at: null }
    });
  }
}

module.exports = {
    SequelizeClientesRepository
};