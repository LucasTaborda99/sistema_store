// Rota Categoria

const express = require('express')
const router = express.Router()
const categoriaController = require('../controllers/categoriaController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarCategoria', categoriaController.adicionarCategoria)
router.get('/getCategoria', categoriaController.getCategoria)
router.patch('/updateCategoria', categoriaController.updateCategoria)
router.delete('/deleteCategoria', categoriaController.deleteCategoria)

module.exports = router