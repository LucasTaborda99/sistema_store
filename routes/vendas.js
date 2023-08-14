// Rota Vendas

const express = require('express')
const router = express.Router()
const vendasController = require('../controllers/vendasController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/registrarVenda', aut.autenticacaoToken, vendasController.registrarVenda)
router.get('/getVenda', aut.autenticacaoToken, vendasController.getVenda)

module.exports = router