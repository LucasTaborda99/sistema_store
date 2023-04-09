// Rota Categoria

const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarCategoria', aut.autenticacaoToken, verRole.verificaRole, categoriaController.adicionarCategoria)
router.get('/getCategoria', aut.autenticacaoToken, categoriaController.getCategoria)
router.patch('/updateCategoria', aut.autenticacaoToken, verRole.verificaRole, categoriaController.updateCategoria)
router.delete('/deleteCategoria', aut.autenticacaoToken, verRole.verificaRole, categoriaController.deleteCategoria)

module.exports = router