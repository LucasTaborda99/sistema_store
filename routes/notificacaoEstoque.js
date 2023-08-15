// Rota notificacaoEstoque

const express = require('express')
const router = express.Router()
const notificacaoEstoqueController = require('../controllers/notificacaoEstoqueController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.get('/verificaEstoqueBaixo', aut.autenticacaoToken, notificacaoEstoqueController.verificaEstoqueBaixo)

module.exports = router