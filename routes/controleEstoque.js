// Rota controleEstoque

const express = require('express')
const router = express.Router()
const controleEstoqueController = require('../controllers/controleEstoqueController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/registrarControleEstoque', aut.autenticacaoToken, controleEstoqueController.registrarControleEstoque)
router.get('/getControleEstoque', aut.autenticacaoToken, controleEstoqueController.getControleEstoque)
router.get('/getProdutosEstoqueBaixo', aut.autenticacaoToken, controleEstoqueController.getProdutosEstoqueBaixo)
router.post('/atualizarControleEstoque', aut.autenticacaoToken, controleEstoqueController.atualizarControleEstoque)
router.delete('/deletarControleEstoque/:id', aut.autenticacaoToken, controleEstoqueController.deletarControleEstoque)

module.exports = router