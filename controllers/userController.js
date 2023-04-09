//  User Controller

const getConnection = require('../connection');

const { Usuario } = require('../models/index');

// Importando a biblioteca bcryptjs, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcryptjs');

// Importando a biblioteca - JSON Web Token(JWT), para gerar Token aos usuários ao acessar o sistema
const jwt = require('jsonwebtoken')

// Importando a biblioteca - Nodemailer, para mandar email através do objeto "transportador"
const nodemailer = require('nodemailer');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');

require('dotenv').config()

// Cadastra um usuário, com status default 'false' e role 'user', a senha é salva em formato de hash no banco de dados
async function cadastrarUsuarios(req, res) {
    try {
        const user = req.body;
        const email = user.email;
        const saltRounds = 10;

        const foundUser = await Usuario.findOne({ where: { email } });
        if (foundUser) {
            return res.status(400).json({ message: "Email já existente" });
        }

        const hash = await bcrypt.hash(user.senha, saltRounds);

        const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const newUser = await Usuario.create({
            nome: user.nome,
            numero_contato: user.numero_contato,
            email: user.email,
            senha: hash,
            role: 'user',
            status: 'false',
            created_by: 'user',
            created_at: createdAt
        });
        return res.status(200).json({ message: "Usuário registrado com sucesso" });
    } catch (err) {
        return res.status(500).json({ message: "Erro ao cadastrar usuário" });
    }
}
  
// Realiza o login de um usuário, por email e senha, após aprovação do role = 'admin', mudando o status do usuário para 'true',
// será permitido o login desse usuário ao sistema, gerando um token jwt ao usuário, válido por 24 horas
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const foundUser = await Usuario.findOne({ where: { email } });
        if (!foundUser) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        const validPassword = await bcrypt.compare(senha, foundUser.senha);
        if (!validPassword) {
            return res.status(401).json({ message: "Email ou senha incorretos" });
        }

        if (foundUser.status !== 'true') {
            return res.status(401).json({ message: "Espere pela aprovação do administrador" });
        }

        const accessToken = jwt.sign({ email: foundUser.email, role: foundUser.role }, process.env.ACCESS_TOKEN, { expiresIn: "24h" });
        return res.status(200).json({ token: accessToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao realizar login" });
    }
}

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

// Envia email ao usuário com a senha dele, caso ele tenha esquecido
async function esqueciSenha(req, res) {
    try {
        const user = req.body;
        const foundUser = await Usuario.findOne({ where: { email: user.email } });
        if (!foundUser) {
            return res.status(200).json({ message: "Sua pesquisa não retornou nenhum resultado. Por favor tente novamente com outra informação" });
        } else {
            let emailCorpo = {
                from: process.env.EMAIL,
                to: foundUser.email,
                subject: 'Recuperação de senha do sistemaStore',
                html: '<p><b>Seus detalhes de login ao sistemaStore</b><br><b>Email: </b>' + foundUser.email + '<br><b>Senha: </b>' + foundUser.senha + '<br><a href="http://localhost:4200/">Clique aqui para fazer login</a></p>'
            };
            await transportador.sendMail(emailCorpo);
            return res.status(200).json({ message: "Senha enviada com sucesso para o seu email" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao recuperar senha" });
    }
}

// Visualiza todos os usuários que possuem role 'user' e que não foram deletados, essa função só está disponível aos roles = 'admin'
async function get(req, res) {
    try {
      const users = await Usuario.findAll({
        attributes: ['id', 'nome', 'numero_contato', 'email', 'status'],
        where: { role: 'user', deleted_at: null}
      });
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
}

// Atualiza o status dos usuários, de 'false' para 'true', podendo assim o usuário realizar o login no sistema, funcionalidade disponível apenas aos roles = 'admin'

async function updateStatusERole(req, res) {
  try {
    const { id, status, role } = req.body;
    const updatedBy = res.locals.email;
    const user = await Usuario.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "ID não existente" });
    }
    if (res.locals.role !== 'admin') {
      return res.status(401).json({ message: "Apenas administradores têm permissão para atualizar o status de usuários" });
    }

    console.log("updated_at before update:", user.updated_at); // adicionando um console.log para visualizar a data antes da atualização

    await Usuario.update(
      {
        status,
        role,
        updated_at: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss'),
        updated_by: updatedBy
      },
      { where: { id } },
    );

    return res.status(200).json({ message: "Usuário atualizado com sucesso" });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err);
  }
}

// Atualiza os dados do usuário (nome, número de contato e senha) de acordo com o email, a senha é salva em hash no banco de dados,
// e é salvo no banco de dados a data com horário que a atualização foi feita e o email do usuário que realizou a atualização
async function updateUser(req, res) {
    const user = req.body
    const saltRounds = 10;
    const querySelect = 'SELECT email FROM usuarios WHERE email = ?'
    const queryUpdate = 'UPDATE usuarios set nome = ?, numero_contato = ?, senha = ?, updated_at = NOW(), updated_by = ? WHERE email = ?'
    let connection

    try {
        const connection = await getConnection();
        const [results] = await connection.query(querySelect, [user.email]);

        if (results.length === 0) {
            connection.release();
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const hash = await bcrypt.hash(user.senha, saltRounds);
        const [updateResult] = await connection.query(queryUpdate, [user.nome, user.numero_contato, hash, res.locals.email, user.email]);

        if (updateResult.affectedRows === 0) {
            connection.release();
            return res.status(404).json({ message: 'Email ou ID não encontrado' })
        }

        return res.status(200).json({ message: 'Usuário atualizado com sucesso' })
    } catch (err) {
        console.error(err);
        return res.status(500).json(err)
    } finally {
        if(connection)
        connection.release();
    }
}

// Check se token do usuário é válido
async function checarToken(req, res) {
    try {
        return res.status(200).json({ message: "true" });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// Altera senha do usuário, a partir da senha antiga e a nova
async function alterarSenha(req, res) {
    const user = req.body
    const email = res.locals.email
    const senhaNova = user.senhaNova

    try {
        const connection = await getConnection();
        let query = "SELECT * FROM usuarios WHERE email = ?"
        const [rows] = await connection.query(query, [email]);
        if (rows.length <= 0) {
            connection.release();
            return res.status(400).json({ message: "Usuário não encontrado" })
        } else {
            const senhaAtual = rows[0].senha;
            const senhaAntiga = user.senhaAntiga;
            const senhaAtualCorreta = bcrypt.compareSync(senhaAntiga, senhaAtual)

            if (!senhaAtualCorreta) {
                connection.release();
                return res.status(400).json({ message: 'Senha antiga incorreta' })
            } else {
                const senhaNovaHash = bcrypt.hashSync(senhaNova, 10)
                query = "UPDATE usuarios set senha = ?, updated_at = NOW(), updated_by = ? WHERE email = ?"
                const [results] = await connection.query(query, [senhaNovaHash, res.locals.email, email]);
                connection.release();
                return res.status(200).json({ message: "Senha alterada com sucesso" })
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// 'Deleta' usuário ('softdelete', atualiza a coluna 'deleted_at' com a data e horário que o usuário foi deletado
// e atualiza a coluna deleted_by com o email do usuário que deletou), funcionalidade disponível apenas aos roles = 'admin'
async function deleteUser(req, res) {
    try {
        const user = req.body;
        const deletedBy = res.locals.email;

        const query = "UPDATE usuarios SET deleted_at = NOW(), deleted_by = ? WHERE email = ?";
        const connection = await getConnection();
        const [results] = await connection.query(query, [deletedBy, user.email]);
        connection.release();

        if (results.affectedRows == 0) {
            return res.status(404).json({ message: "Email não encontrado" });
        }

        return res.status(200).json({ message: "Usuário marcado como excluído com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Ops! Algo deu errado. Por favor, tente novamente mais tarde" });
    }
}
  
module.exports = {
    cadastrarUsuarios,
    login,
    esqueciSenha,
    get,
    updateStatusERole,
    updateUser,
    checarToken,
    alterarSenha,
    deleteUser
}