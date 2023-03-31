const express = require('express')
const connection = require('../connection')
const router = express.Router()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

// Cria categoria dos produtos, funcionalidade disponível apenas aos roles = 'admin'
router.post('/adicionarCategoria', aut.autenticacaoToken, verRole.verificaRole, (req, res, next) => {
    const categoria = req.body
    const querySelect = "SELECT COUNT(*) as 'Total de Registros' FROM categoria WHERE nome = ?"
    const queryInsert = "INSERT INTO categoria (nome) VALUES (?)"

    connection.query(querySelect, [categoria.nome], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        }

        const totalDeRegistros = results[0]['Total de Registros']
        if (totalDeRegistros > 0) {
          return res.status(400).json({ message: 'Já existe uma categoria com esse nome' })
        }
        
        connection.query(queryInsert, [categoria.nome], (err, results) => {
            if(err){
                return res.status(500).json(err)
            }
            return res.status(200).json({message: "Categoria adicionada com sucesso"})
        })
    })
})

// Visualiza categoria, ordenando pelo ID
router.get('/get', aut.autenticacaoToken, (req, res, next) => {
    let query = "SELECT * FROM categoria ORDER BY id"
    connection.query(query, (err, results) => {
        if(err){
            return res.status(500).json(err)
        } else {
            if(results.length <= 0) {
                return res.status(404).json({message: 'Nenhuma categoria encontrada'})
            } else {
                return res.status(200).json(results)
            }
        }
    })
})

// Atualiza categoria pelo ID, funcionalidade disponível apenas aos roles = 'admin'
router.patch('/update', aut.autenticacaoToken, verRole.verificaRole, (req, res, next) => {

    const categoria = req.body
    const querySelect = "SELECT COUNT(*) as 'Total de Registros' FROM categoria WHERE nome = ? AND id <> ?"
    const queryUpdate = "UPDATE categoria SET nome = ? WHERE id = ?"

    connection.query(querySelect, [categoria.nome, categoria.id], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        }
        
        const totalDeRegistros = results[0]['Total de Registros']
        if (totalDeRegistros > 0) {
          return res.status(400).json({ message: 'Já existe uma categoria com esse nome' })
        }
        
        connection.query(queryUpdate, [categoria.nome, categoria.id], (err, results) => {
            if(err){
                return res.status(500).json(err)
            } else {
                if(results.affectedRows == 0) {
                     return res.status(404).json({message: "Categoria com esse ID não encontrado"})
                }
                return res.status(200).json({message: "Categoria atualizada com sucesso"})
            }
        })
    })
})

// Deleta categoria pelo ID, funcionalidade disponível apenas aos roles = 'admin'
router.delete('/delete', aut.autenticacaoToken, verRole.verificaRole, (req, res, next) => {
    let produto = req.body
    query = "DELETE FROM categoria WHERE id = ?"
    connection.query(query, [produto.id], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        } else {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "Categoria com esse ID não encontrado"})
            } else {
                return res.status(200).json({message: "Categoria deletada com sucesso"})
            }
        }
    })
})

module.exports = router