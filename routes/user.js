// Rota user

const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/cadastrarUsuarios', userController.cadastrarUsuarios)
router.post('/login', userController.login)
router.post('/esqueciSenha', userController.esqueciSenha)
router.get('/get', aut.autenticacaoToken, verRole.verificaRole, userController.get)
router.patch('/updateStatusERole', aut.autenticacaoToken, verRole.verificaRole, userController.updateStatusERole)
router.patch('/updateUser', aut.autenticacaoToken, userController.updateUser)
router.get('/checarToken', aut.autenticacaoToken, userController.checarToken)
router.post('/alterarSenha', aut.autenticacaoToken, userController.alterarSenha)
router.delete('/deleteUser', aut.autenticacaoToken, verRole.verificaRole, userController.deleteUser)

module.exports = router