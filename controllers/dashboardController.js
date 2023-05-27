// Dashboard - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Categoria
const Categoria = require('../models').Categoria;

// Importando a model Produto
const Produto = require('../models').Produto;

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');
const { NOW } = require('sequelize');

require('dotenv').config()

// Visualiza categoria, ordenando pelo ID
async function detailsDashboard(req, res) {
    try {
      const categorias = await Categoria.count({
        where: { deleted_at: null}
      });

      const produtos = await Produto.count({
        where: { deleted_at: null}
      });
      return res.status(200).json({ categoriasCount: categorias, produtosCount: produtos });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  module.exports = {
    detailsDashboard,
}
