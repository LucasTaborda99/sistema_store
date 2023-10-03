const express = require('express');
const clienteMaisComprouController = require('../controllers/clienteMaisComprouController');

const router = express.Router();

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

// Rota para encontrar o cliente que mais comprou
router.get('/clienteMaisComprou', clienteMaisComprouController.clienteMaisComprou);
router.get('/fornecedorMaisCompras', clienteMaisComprouController.fornecedorMaisCompras);
router.get('/produtoMaisVendido', clienteMaisComprouController.produtoMaisVendido);

module.exports = router;
