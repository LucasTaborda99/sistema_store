// Categoria - Controller 

// const { Categoria } = require('../models/index');
const Categoria = require('../models').Categoria;

const getConnection = require('../connection');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Cria categoria dos produtos, funcionalidade disponível apenas aos roles = 'admin'
async function adicionarCategoria (req, res){
  try {
    const categoria = req.body;
    const nome = categoria.nome;
    const createdBy = res.locals.email;
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');


    const foundCategoria = await Categoria.findOne({ where: { nome } });
    
    if (foundCategoria) {
        return res.status(400).json({ message: "Categoria já existente" });
    }

    const newCategoria = await Categoria.create({
      nome: categoria.nome,
      created_by: createdBy,
      created_at: createdAt
    });

    res.status(201).json({ message: 'Categoria adicionada com sucesso' });
  } catch (error) {
    console.error(error);
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

      const query = "UPDATE categoria SET deleted_at = NOW(), deleted_by = ? WHERE id = ?";
      const connection = await getConnection();
      const [results] = await connection.query(query, [deletedBy, categoria.id]);
      connection.release();

      if (results.affectedRows == 0) {
          return res.status(404).json({ message: "ID não encontrado" });
      }

      return res.status(200).json({ message: "Categoria marcada como excluído com sucesso" });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
  }
}

module.exports = {
    adicionarCategoria,
    getCategoria,
    updateCategoria,
    deleteCategoria
}