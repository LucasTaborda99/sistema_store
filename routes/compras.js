// Rota Compras

const express = require('express')
const router = express.Router()
const comprasController = require('../controllers/comprasController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/registrarCompra', aut.autenticacaoToken, comprasController.registrarCompra)
router.get('/getCompra', aut.autenticacaoToken, comprasController.getCompra)

module.exports = router