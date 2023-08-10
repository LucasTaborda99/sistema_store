// Rota Clientes

const express = require('express')
const router = express.Router()
const clientesController = require('../controllers/clientesController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarCliente', aut.autenticacaoToken, clientesController.adicionarCliente)
router.get('/getCliente', aut.autenticacaoToken, clientesController.getCliente)
router.patch('/updateCliente', aut.autenticacaoToken, clientesController.updateCliente)
router.patch('/deleteCliente', aut.autenticacaoToken, verRole.verificaRole, clientesController.deleteCliente)

module.exports = router