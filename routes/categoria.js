const express = require('express')
const connection = require('../connection')
const router = express.Router()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/adicionarCategoria', aut.autenticacaoToken, verRole.verificaRole, (req, res, next) => {
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

router.get('/get', aut.autenticacaoToken, (req, res, next) => {
    let query = "SELECT * FROM categoria ORDER BY id"
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', aut.autenticacaoToken, verRole.verificaRole, (req, res, next) => {
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