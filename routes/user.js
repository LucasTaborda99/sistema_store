const express = require('express')
const connection = require('../connection')
const router = express.Router()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
require('dotenv').config()

router.post('/signup', (req, res) => {
    const user = req.body
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

router.post('/login', (req, res) => {
        const user = req.body
        query = 'SELECT email, senha, role, status FROM user WHERE email = ?'
        connection.query(query, [user.email], (err, results) => {
            if(!err){
                if(results.length <= 0 || results[0].senha != user.senha) {
                    return res.status(401).json({message: "Email ou senha incorretos"})
                } else if(results[0].status != 'true') {
                    return res.status(401).json({message: "Espere pela aprovação do administrador"})
                } else if(results[0].senha === user.senha) {
                    const response = {email: results[0].email, role: results[0].role}
                    const acessoToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: "8h"})
                    res.status(200).json({token: acessoToken})
                } else {
                    return res.status(400).json({message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde"})
                }
            }
        else {
            return res.status(500).json(err)
        }
    })
})

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotPassword', (req, res) => {
    const user = req.body
    query = "SELECT email, senha FROM user WHERE email = ?"
    connection.query(query, [user.email], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(200).json({message: "Sua pesquisa não retornou nenhum resultado. Por favor tente novamente com outra informação"})
            } else {
                let emailCorpo = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Recuperação de senha do sistemaStore',
                    html: '<p><b>Seus detalhes de login ao sistemaStore</b><br><b>Email: </b>'+results[0].email+'<br><b>Senha: </b>'+results[0].senha+'<br><a href="http://localhost:4200/">Clique aqui para fazer login</a></p>'
                };
                transporter.sendMail(emailCorpo, function(error, informação){
                    if(error) {
                        console.log(error)
                    } else {
                        console.log('Email enviado: ' +informação.response)
                    }
                })
                return res.status(200).json({message: "Senha enviada com sucesso para o seu email"})
            }
        } else {
            return res.status.json(err)
        }
    })
})

module.exports = router