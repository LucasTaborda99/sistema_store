// Clientes - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Clientes
const { Clientes } = require('../models/index');

// Importando o módulo clientesService.js que está localizada na pasta services
const { SequelizeClientesRepository } = require('../services/clientesService');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Cria Cliente, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarCliente (req, res){
  try {
    const cliente = req.body;
    const nome = cliente.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    const foundCliente = await Clientes.findOne({ where: { nome, deleted_by: null } });
    
    if (foundCliente) {
        return res.status(400).json({ message: "Cliente já existente e não está marcado como deletado" });
    }

    const newCliente = await Clientes.create({
      nome: cliente.nome,
      endereco: cliente.endereco,
      telefone: cliente.telefone,
      email: cliente.email,
      cpf: cliente.cpf,
      created_by: createdBy,
      created_at: createdAt,
    });

    res.status(201).json({ message: 'Cliente adicionado com sucesso' });
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao criar o cliente' });
    }
}

// Visualiza Cliente, ordenando pelo ID
async function getCliente(req, res) {
  try {
    // Cria uma instância da classe SequelizeClientesRepository
    const clientesRepository = new SequelizeClientesRepository();

    // Chama o método findAllClientes da instância de clientesRepository e aguarda sua conclusão
    const clientes = await clientesRepository.findAllClientes();

    return res.status(200).json(clientes);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// Atualiza informações do Cliente
async function updateCliente(req, res) {
  const cliente = req.body
  const updatedBy = res.locals.email;
  const querySelect = 'SELECT nome FROM clientes WHERE id = ?'
  const queryUpdate = 'UPDATE clientes set nome = ?, endereco = ?, telefone = ?, email = ?, cpf = ?, updated_at = NOW(), updated_by = ? WHERE id = ?';
  let connection

  try {
      const db = Database.getInstance();
      connection = await db.getConnection();

      const [results] = await connection.query(querySelect, [cliente.id]);

      if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: 'Cliente não encontrado' })
      }

      const [updateResult] = await connection.query(queryUpdate, [cliente.nome, cliente.endereco, cliente.telefone, cliente.email, cliente.cpf, updatedBy, cliente.id]);

      if (updateResult.affectedRows === 0) {
          connection.release();
          return res.status(404).json({ message: 'Nome do cliente não encontrado' })
      }

      return res.status(200).json({ message: 'Cliente atualizado com sucesso' })
  } catch (err) {
      console.error(err);
      return res.status(500).json(err)
  } finally {
      if(connection)
      connection.release();
  }
}

// 'Deleta' cliente ('softdelete', atualiza a coluna 'deleted_at' com a data e horário que o produto foi deletado
// e atualiza a coluna deleted_by com o email do usuário que deletou), funcionalidade disponível apenas aos roles = 'admin'
async function deleteCliente(req, res) {
  try {
      const cliente = req.body;
      const deletedBy = res.locals.email;

      const query = "UPDATE clientes SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";

      const db = Database.getInstance();
      const connection = await db.getConnection();

      const [results] = await connection.query(query, [deletedBy, cliente.id]);
      connection.release();

      if (results.affectedRows == 0) {
          return res.status(404).json({ message: "ID não encontrado" });
      }

      if (res.locals.role !== 'admin') {
        return res.status(401).json({ message: "Apenas administradores têm permissão para deletar clientes" });
      }

      return res.status(200).json({ message: "Cliente marcado como excluído com sucesso" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarCliente,
    getCliente,
    updateCliente,
    deleteCliente
}