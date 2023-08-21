// Dashboard - Controller 

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando a model Categoria
const Categoria = require('../models').Categoria;

// Importando a model Produto
const Produto = require('../models').Produto;

// Importando a model Fornecedor
const Fornecedor = require('../models').Fornecedor;

// Importando a model Vendas
const Vendas = require('../models').Vendas;

// Importando a model Compras
const Compras = require('../models').Compras;

// Importando a model Clientes
const Clientes = require('../models').Clientes;

// Importando a model ControleEstoque
const ControleEstoque = require('../models').ControleEstoque;

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

      const fornecedores = await Fornecedor.count({
        where: { deleted_at: null}
      });

      const compras = await Compras.count({
        where: { deleted_at: null}
      });

      const vendas = await Vendas.count({
        where: { deleted_at: null}
      });

      const clientes = await Clientes.count({
        where: { deleted_at: null}
      });

      const controleEstoque = await ControleEstoque.count({
      });

      return res.status(200).json({ categoriasCount: categorias, produtosCount: produtos, fornecedoresCount: fornecedores,
        comprasCount: compras, vendasCount: vendas, clientesCount: clientes, controleEstoqueCount: controleEstoque});
       
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  module.exports = {
    detailsDashboard,
}
