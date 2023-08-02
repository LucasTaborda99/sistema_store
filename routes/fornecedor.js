// Rota Fornecedor

const express = require('express')
const router = express.Router()
const fornecedorController = require('../controllers/fornecedorController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarFornecedor', aut.autenticacaoToken, fornecedorController.adicionarFornecedor)
router.get('/getFornecedor', aut.autenticacaoToken, fornecedorController.getFornecedor)
router.patch('/updateFornecedor', aut.autenticacaoToken, fornecedorController.updateFornecedor)
router.patch('/deleteFornecedor', aut.autenticacaoToken, verRole.verificaRole, fornecedorController.deleteFornecedor)

module.exports = router