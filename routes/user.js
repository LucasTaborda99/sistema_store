const express = require('express')
const connection = require('../connection')
const router = express.Router()

// Importando a biblioteca bcryptjs, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcryptjs');

// Importando a biblioteca - JSON Web Token(JWT), para gerar Token aos usuários ao acessar o sistema
const jwt = require('jsonwebtoken')

// Importando a biblioteca - Nodemailer, para mandar email através do objeto "transportador"
const nodemailer = require('nodemailer')

require('dotenv').config()
let aut = require('../services/autenticacao')
let verRole = require('../services/verificaRole')

router.post('/cadastrar', (req, res) => {
    const user = req.body
    const saltRounds = 10; // número de rounds para o salt

    query = "SELECT email, senha, role, status FROM user WHERE email = ?"
    connection.query(query, [user.email], (err, results) => {
        if(!err){
            if(results.length <= 0) {
                query = "INSERT INTO user (nome, numero_contato, email, senha, status, role) VALUES (?, ?, ?, ?, 'false', 'user')"
                bcrypt.hash(user.senha, saltRounds, (err, hash) => {
                    if (err) {
                        return res.status(500).json(err);
                    }
                    connection.query(query, [user.nome, user.numero_contato, user.email, hash], (err, results) => {
                        if(!err){
                            return res.status(200).json({message: "Usuário registrado com sucesso"})
                        } else {
                            return res.status(500).json(err)
                        }
                    })
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
    const { email, senha } = req.body;
    const query = 'SELECT email, senha, role, status FROM user WHERE email = ?';
    connection.query(query, [email], (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (results.length === 0) {
        return res.status(401).json({message: "Email ou senha incorretos"});
      } else {
        bcrypt.compare(senha, results[0].senha, (err, result) => {
          if (result) {
            if (results[0].status !== 'true') {
              return res.status(401).json({message: "Espere pela aprovação do administrador"});
            } else {
              const response = {email: results[0].email, role: results[0].role};
              const acessoToken = jwt.sign(response, process.env.ACCESS_TOKEN, {expiresIn: "24h"});
              return res.status(200).json({token: acessoToken});
            }
          } else {
            return res.status(401).json({message: "Email ou senha incorretos"});
          }
        })
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

router.patch('/updateStatus', aut.autenticacaoToken, verRole.verificaRole, (req, res) => {
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

router.patch('/updateUser', aut.autenticacaoToken, (req, res) => {
    const user = req.body
    const saltRounds = 10; // número de rounds para o salt
    const querySelect = 'SELECT email FROM user WHERE email = ?'
    const queryUpdate = 'UPDATE user set nome = ?, numero_contato = ?, senha = ? WHERE email = ?'

    connection.query(querySelect, [user.email], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        } else {
            if(results.length === 0) {
                return res.status(404).json({message: 'Usuário não encontrado'})
            }
            bcrypt.hash(user.senha, saltRounds, (err, hash) => {
                if (err) {
                    return res.status(500).json(err);
                }
                connection.query(queryUpdate, [user.nome, user.numero_contato, hash, user.email], (err, results) => {
                    if(err) {
                        return res.status(500).json(err)
                    } else {
                        if(results.affectedRows === 0) {
                            return res.status(404).json({message: 'Email ou ID não encontrado'})
                        }
                        return res.status(200).json({message: 'Usuário atualizado com sucesso'})
                    }
                })
            })
        }
    })
})

router.get('/checarToken', aut.autenticacaoToken, (req, res) => {
    return res.status(200).json({message: "true"})
})

router.post('/alterarSenha', aut.autenticacaoToken, (req, res) => {
    const user = req.body
    const email = res.locals.email
    const senhaNova = user.senhaNova

    let query = "SELECT * FROM user WHERE email = ?"
    connection.query(query, [email], (err, results) => {
        if(!err){
            if(results <= 0) {
                return res.status(400).json({message: "Usuário não encontrado"})
            } else {
                const senhaAtual = results[0].senha;
                const senhaAntiga = user.senhaAntiga;
                const senhaAtualCorreta = bcrypt.compareSync(senhaAntiga, senhaAtual)

                if(!senhaAtualCorreta) {
                    return res.status(400).json({message: 'Senha antiga incorreta'})
                } else {
                    const senhaNovaHash = bcrypt.hashSync(senhaNova, 10)
                    query = "UPDATE user set senha = ? WHERE email = ?"
                    connection.query(query, [senhaNovaHash, email], (err, results) => {
                        if(!err) {
                            return res.status(200).json({message: "Senha alterada com sucesso"})
                        } else {
                            return res.status(500).json(err)
                        }
                    })
                }
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