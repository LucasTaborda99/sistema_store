// Categoria - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Categoria
const Categoria = require('../models').Categoria;

// Importando a model Produto
const { Produto } = require('../models/index');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

// Importando o módulo logger
const logger = require('../services/logger');

require('dotenv').config()

// Cria categoria dos produtos, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarCategoria(req, res) {
  try {
    const categoria = req.body;
    const nome = categoria.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

    const foundCategoria = await Categoria.findOne({ where: { nome } });

    if (foundCategoria && foundCategoria.deleted_by === null) {
      logger.warn(`Tentativa de adicionar categoria já existente e não marcado como deletado: ${nome}`);
      return res.status(400).json({ message: "Categoria já existente e não está marcado como deletado" });
    }

    if (foundCategoria && foundCategoria.deleted_by !== null) {
      await foundCategoria.update({
        created_by: createdBy,
        created_at: createdAt,
        deleted_by: null,
        deleted_at: null
      });

      return res.status(201).json({ message: 'Categoria adicionada com sucesso' });
    }

    const newCategoria = await Categoria.create({
      nome: categoria.nome,
      created_by: createdBy,
      created_at: createdAt,
      
    });

    logger.info(`Categoria "${categoria.nome}" foi adicionado por "${createdBy}"`);
    res.status(201).json({ message: 'Categoria adicionada com sucesso' });
  } catch (error) {
    console.error(error);
    logger.error(`Erro ao criar categoria: ${error.message}`);
    res.status(500).json({ message: 'Ocorreu um erro ao criar a categoria' });
  }
}


// Visualiza categoria, ordenando pelo ID
async function getCategoria(req, res) {
  try {
    const categorias = await Categoria.findAll({
      order: ['id'],
      where: { deleted_at: null}
    });
    return res.status(200).json(categorias);
  } catch (err) {
    return res.status(500).json(err);
  }
}

// Atualiza categoria pelo ID, funcionalidade disponível apenas aos roles = 'admin'
const updateCategoria = async (req, res) => {
  
  const { id, nome } = req.body;
  const updatedBy = res.locals.email;
  const updatedAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');

  try {

    // Apenas um registro é esperado
    const categoriaAntes = await Categoria.findByPk(id);

    // busca a categoria pelo ID
    const categoria = await Categoria.findByPk(id);
    if (!categoria) {
      return res.status(404).json({ message: 'Categoria com esse ID não encontrado' });
    }
    // verifica se já existe uma categoria com esse nome
    const categoriaExistente = await Categoria.findOne({ where: { nome } });
    if (categoriaExistente && categoriaExistente.id !== categoria.id) {
      return res.status(400).json({ message: 'Já existe uma categoria com esse nome' });
    }
    // atualiza a categoria
    await categoria.update({ nome, updated_by: updatedBy, updated_at: updatedAt});

    // Mensagem de log
    logger.info(`Categoria com ID ${categoria.id} foi atualizado por ${updatedBy} \n Categoria após a atualização: ${categoria.nome} \n Categoria antes da atualização: ${categoriaAntes.nome}`);
    return res.status(200).json({ message: 'Categoria atualizada com sucesso' });

  } catch (error) {
    res.status(500).json({ message: 'Ocorreu um erro ao atualizar a categoria' });
  }
};

// 'Deleta' categoria ('softdelete', atualiza a coluna 'deleted_at' com a data e horário que a categoria foi deletado
// e atualiza a coluna deleted_by com o email do usuário que deletou), funcionalidade disponível apenas aos roles = 'admin'
async function deleteCategoria(req, res) {
  try {
      const categoria = req.body;
      const deletedBy = res.locals.email;

      // Verificando se algum produto está utilizando a categoria
      const produtosComCategoria = await Produto.findAll({
        where: { id_categoria: categoria.id },
      });
      console.log('Products with this category:', produtosComCategoria);
  
      if (produtosComCategoria.length > 0) {
        return res.status(400).json({ message: 'Não é possível excluir a categoria, pois existem produtos associados a ela' });
      }

      const query = "UPDATE categoria SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";
      const db = Database.getInstance();
      const connection = await db.getConnection();

      const [results] = await connection.query(query, [deletedBy, categoria.id]);
      connection.release();

      if (results.affectedRows == 0) {
        logger.warn(`Tentativa de exclusão de categoria não encontrado. ID: ${categoria.id}`);
          return res.status(404).json({ message: "ID não encontrado" });
      }



      if (res.locals.role !== 'admin') {
        return res.status(401).json({ message: "Apenas administradores têm permissão para deletar categorias" });
      }

      logger.info(`Categoria com ID ${categoria.id} foi marcado como excluído por ${deletedBy}`);
      return res.status(200).json({ message: "Categoria marcada como excluída com sucesso" });
  } catch (err) {
      console.error(err);
      logger.error(`Erro ao deletar categoria: ${err.message}`);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarCategoria,
    getCategoria,
    updateCategoria,
    deleteCategoria
}