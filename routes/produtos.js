// Rota Produtos

const express = require('express')
const router = express.Router()
const produtosController = require('../controllers/produtosController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarProduto', aut.autenticacaoToken, verRole.verificaRole, produtosController.adicionarProduto)
router.get('/getProduto', aut.autenticacaoToken, produtosController.getProduto)
router.patch('/updateProduto', aut.autenticacaoToken, verRole.verificaRole, produtosController.updateProduto)
router.delete('/deleteProduto', aut.autenticacaoToken, verRole.verificaRole, produtosController.deleteProduto)

module.exports = router