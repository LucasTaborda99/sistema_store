const express = require('express')
const connection = require('../connection')
const router = express.Router()

// Importando a biblioteca - JSON Web Token(JWT), para gerar Token aos usuários ao acessar o sistema
const jwt = require('jsonwebtoken')

// Importando a biblioteca - Nodemailer, para mandar email através do objeto "transportador"
const nodemailer = require('nodemailer')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/cadastrar', (req, res) => {
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

                    // Criando um novo Token
                    const acessoToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: "24h"})

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

// Criando o objeto "transportador" de email, usando a biblioteca Nodemailer,
// para conectar à conta do Gmail do usuário e enviar email
let transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// verificando configuração de conexão para mandar mensagem
transportador.verify(function (error) {
    if (!error) {
        console.log("O servidor está pronto para receber nossas mensagens");
    } else {
        console.log(error);
    }
})

router.post('/esqueciSenha', (req, res) => {
    const user = req.body
    query = "SELECT email, senha FROM user WHERE email = ?"
    connection.query(query, [user.email], (err, results) => {
        if(!err) {
            if(results.length <= 0) {
                return res.status(200).json({message: "Sua pesquisa não retornou nenhum resultado. Por favor tente novamente com outra informação"})
            } else {
                // Corpo do email que será enviado ao usuário para recuperação de senha
                let emailCorpo = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Recuperação de senha do sistemaStore',
                    html: '<p><b>Seus detalhes de login ao sistemaStore</b><br><b>Email: </b>'+results[0].email+'<br><b>Senha: </b>'+results[0].senha+'<br><a href="http://localhost:4200/">Clique aqui para fazer login</a></p>'
                }

                transportador.sendMail(emailCorpo, function(error, informação){
                    if(!error) {
                        console.log('Email enviado: ' + informação.response)
                    } else {
                        console.log(error)
                    }
                })
                return res.status(200).json({message: "Senha enviada com sucesso para o seu email"})
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/get', aut.autenticacaoToken, verRole.verificaRole, (req, res) => {
    const user = req.body
    query = "SELECT id, nome, numero_contato, email, status FROM user WHERE role = 'user'"
    connection.query(query, (err, results) => {
        if(!err){
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update', aut.autenticacaoToken, verRole.verificaRole, (req, res) => {
    const user = req.body
    let query = "UPDATE user set status = ? WHERE id = ?"
    connection.query(query, [user.status, user.id], (err, results) => {
        if(!err){
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "ID não existente"})
            }
            return res.status(200).json({message: "Usuário atualizado com sucesso"})
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/checarToken', aut.autenticacaoToken, (req, res) => {
    return res.status(200).json({message: "true"})
})

router.post('/alterarSenha', aut.autenticacaoToken, (req, res) => {
    const user = req.body
    const email = res.locals.email
    let query = "SELECT * FROM user WHERE email = ? and senha = ?"
    connection.query(query, [email, user.senhaAntiga], (err, results) => {
        if(!err){
            if(results <= 0) {
                return res.status(400).json({message: "Senha antiga incorreta"})
            } 
            else if(results[0].senha == user.senhaAntiga){
                query = "UPDATE user set senha = ? WHERE email = ?"
                connection.query(query, [user.senhaNova, email], (err, results) => {
                    if(!err) {
                        return res.status(200).json({message: "Senha alterada com sucesso"})
                    } else {
                        return res.status(500).json(err)
                    }
                })
            } else {
                return res.status(500).json({message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde"})
            }
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/deleteUser', aut.autenticacaoToken, verRole.verificaRole, (req, res) => {
    const user = req.body
    let query = 'DELETE FROM user WHERE email = ?'
    connection.query(query, [user.email], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: 'Email não encontrado'})
            }
            return res.status(200).json({message: 'Usuário deletado com sucesso'})
        } else {
            return res.status(500).json({message: 'Ops! Algo deu errado. Por favor, tente novamente mais tarde'})
        }
    })
})

module.exports = router