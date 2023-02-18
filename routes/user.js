const express = require('express')
const connection = require('../connection')
const router = express.Router()

router.post('/signup', (req, res) => {
    let user = req.body
    query = "SELECT email, senha, role, status FROM user WHERE email = ?"
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0) {
                query = "INSERT INTO user (nome, numero_contato, email, senha, status, role) VALUES (?, ?, ?, ?, 'false', 'user')"
                connection.query(query, [user.nome, user.numero_contato, user.email, user.senha], (err, results) => {
                    if(!err){
                        return res.status(200).json({message: "Usuário registrado com sucesso"})
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(400).json({message: "Email já existente"})
            }
        }
        else {
            return res.status(500).json(err)
        }
    })
})

module.exports = router