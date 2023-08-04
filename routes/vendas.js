// Rota Vendas

const express = require('express')
const router = express.Router()
const vendasController = require('../controllers/vendasController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/registrarVenda', aut.autenticacaoToken, vendasController.registrarVenda)
router.get('/getVenda', aut.autenticacaoToken, vendasController.getVenda)
// router.patch('/updateFornecedor', aut.autenticacaoToken, fornecedorController.updateFornecedor)
// router.patch('/deleteFornecedor', aut.autenticacaoToken, verRole.verificaRole, fornecedorController.deleteFornecedor)

module.exports = router