// Fornecedor - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Fornecedor
const { Fornecedor } = require('../models/index');

// Importando o módulo fornecedorService.js que está localizada na pasta services
const { SequelizeFornecedorRepository } = require('../services/fornecedorService');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Cria Fornecedor, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarFornecedor (req, res){
  try {
    const fornecedor = req.body;
    const nome = fornecedor.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    const foundFornecedor = await Fornecedor.findOne({ where: { nome, deleted_by: null } });
    
    if (foundFornecedor) {
        return res.status(400).json({ message: "Fornecedor já existente e não está marcado como deletado" });
    }

    const newFornecedor = await Fornecedor.create({
      nome: fornecedor.nome,
      endereco: fornecedor.endereco,
      telefone: fornecedor.telefone,
      cnpj: fornecedor.cnpj,
      created_by: createdBy,
      created_at: createdAt,
    });

    res.status(201).json({ message: 'Fornecedor adicionado com sucesso' });
  } catch (error) {
    console.error(error);
      res.status(500).json({ message: 'Ocorreu um erro ao criar o fornecedor' });
    }
}

// Visualiza Fornecedor, ordenando pelo ID
async function getFornecedor(req, res) {
  try {
    // Cria uma instância da classe SequelizeProdutoRepository
    const fornecedorRepository = new SequelizeFornecedorRepository();

    // Chama o método findAllFornecedores da instância de fornecedorRepository e aguarda sua conclusão
    const fornecedores = await fornecedorRepository.findAllFornecedores();

    return res.status(200).json(fornecedores);
  } catch (err) {
    return res.status(500).json(err);
  }
}

async function updateFornecedor(req, res) {
  const fornecedor = req.body
  const updatedBy = res.locals.email;
  const querySelect = 'SELECT nome FROM fornecedor WHERE id = ?'
  const queryUpdate = 'UPDATE fornecedor set nome = ?, endereco = ?, telefone = ?, updated_at = NOW(), updated_by = ? WHERE id = ?';
  let connection

  try {
      const db = Database.getInstance();
      connection = await db.getConnection();

      const [results] = await connection.query(querySelect, [fornecedor.id]);

      if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: 'Fornecedor não encontrado' })
      }

      const [updateResult] = await connection.query(queryUpdate, [fornecedor.nome, fornecedor.endereco, fornecedor.telefone, updatedBy, fornecedor.id]);

      if (updateResult.affectedRows === 0) {
          connection.release();
          return res.status(404).json({ message: 'Nome do fornecedor não encontrado' })
      }

      return res.status(200).json({ message: 'Fornecedor atualizado com sucesso' })
  } catch (err) {
      console.error(err);
      return res.status(500).json(err)
  } finally {
      if(connection)
      connection.release();
  }
}

// 'Deleta' fornecedor ('softdelete', atualiza a coluna 'deleted_at' com a data e horário que o produto foi deletado
// e atualiza a coluna deleted_by com o email do usuário que deletou), funcionalidade disponível apenas aos roles = 'admin'
async function deleteFornecedor(req, res) {
  try {
      const fornecedor = req.body;
      const deletedBy = res.locals.email;

      const query = "UPDATE fornecedor SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";

      const db = Database.getInstance();
      const connection = await db.getConnection();

      const [results] = await connection.query(query, [deletedBy, fornecedor.id]);
      connection.release();

      if (results.affectedRows == 0) {
          return res.status(404).json({ message: "ID não encontrado" });
      }

      if (res.locals.role !== 'admin') {
        return res.status(401).json({ message: "Apenas administradores têm permissão para deletar fornecedores" });
      }

      return res.status(200).json({ message: "Fornecedor marcado como excluído com sucesso" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarFornecedor,
    getFornecedor,
    updateFornecedor,
    deleteFornecedor
}