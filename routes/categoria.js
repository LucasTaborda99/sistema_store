const express = require('express')
const connection = require('../connection')
const { authToken } = require('../services/authentication')
const router = express.Router()
let auth = require('../services/authentication')
let checkRole = require('../services/checkRole')

router.post('/add', auth.authToken, checkRole.checkingRole, (req, res, next) => {
    const categoria = req.body
    query = "INSERT INTO categoria (nome) VALUES (?)"
    connection.query(query, [categoria.nome], (err, results) => {
        if(!err){
            return res.status(200).json({message: "Categoria adicionada com sucesso"})
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/get', auth.authToken, (req, res, next) => {
    let query = "SELECT * FROM categoria ORDER BY nome"
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', auth.authToken, checkRole.checkingRole, (req, res, next) => {
    let produto = req.body
    query = "UPDATE categoria SET nome = ? WHERE id = ?"
    connection.query(query, [produto.nome, produto.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "ID da categoria não encontrado"})
            }
            return res.status(200).json({message: "Categoria atualizada com sucesso"})
        } else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router