//  User Controller

const getConnection = require('../connection');

const  { Usuario }  = require('../models/index');


async function buscarUsuario() {
    const usuarioEncontrado = await Usuario.findOne({ where: { id: 1 } });
    console.log(usuarioEncontrado);
  }
  
  buscarUsuario();

// Importando a biblioteca bcryptjs, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcryptjs');

// Importando a biblioteca - JSON Web Token(JWT), para gerar Token aos usu�rios ao acessar o sistema
const jwt = require('jsonwebtoken')

// Importando a biblioteca - Nodemailer, para mandar email atrav�s do objeto "transportador"
const nodemailer = require('nodemailer');

require('dotenv').config()

// Cadastra um usu�rio, com status default 'false' e role 'user', a senha � salva em formato de hash no banco de dados
async function cadastrarUsuarios(req, res) {
    try {
        const user = req.body;
        const email = user.email;
        const saltRounds = 10;

        const foundUser = await Usuario.findOne({ where: { email } });
        if (foundUser) {
            return res.status(400).json({ message: "Email j� existente" });
        }

        const hash = await bcrypt.hash(user.senha, saltRounds);
        const newUser = await Usuario.create({
            nome: user.nome,
            numero_contato: user.numero_contato,
            email: user.email,
            senha: hash,
            status: 'false',
            role: 'user',
            created_by: 'admin',
            updated_by: 'admin',
            deleted_by: 'admin',
        });
        return res.status(200).json({ message: "Usu�rio registrado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao cadastrar usu�rio" });
    }
}
  
// Realiza o login de um usu�rio, por email e senha, ap�s aprova��o do role = 'admin', mudando o status do usu�rio para 'true',
// ser� permitido o login desse usu�rio ao sistema, gerando um token jwt ao usu�rio, v�lido por 24 horas
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
            return res.status(401).json({ message: "Espere pela aprova��o do administrador" });
        }

        const accessToken = jwt.sign({ email: foundUser.email, role: foundUser.role }, process.env.ACCESS_TOKEN, { expiresIn: "24h" });
        return res.status(200).json({ token: accessToken });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao realizar login" });
    }
}

// Criando o objeto "transportador" de email, usando a biblioteca Nodemailer,
// para conectar � conta do Gmail do usu�rio e enviar email
let transportador = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

// verificando configura��o de conex�o para mandar mensagem
transportador.verify(function (error) {
    if (!error) {
        console.log("O servidor est� pronto para receber nossas mensagens");
    } else {
        console.log(error);
    }
})

// Envia email ao usu�rio com a senha dele, caso ele tenha esquecido
async function esqueciSenha(req, res) {
    try {
        const user = req.body;
        const foundUser = await Usuario.findOne({ where: { email: user.email } });
        if (!foundUser) {
            return res.status(200).json({ message: "Sua pesquisa n�o retornou nenhum resultado. Por favor tente novamente com outra informa��o" });
        } else {
            let emailCorpo = {
                from: process.env.EMAIL,
                to: foundUser.email,
                subject: 'Recupera��o de senha do sistemaStore',
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

// Visualiza todos os usu�rios que possuem role 'user' e que n�o foram deletados, essa fun��o s� est� dispon�vel aos roles = 'admin'
async function get(req, res) {
    try {
      const users = await Usuario.findAll({
        attributes: ['id', 'nome', 'numero_contato', 'email', 'status'],
        where: { role: 'user', deleted_at: null }
      });
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
  }

// Atualiza o status dos usu�rios, de 'false' para 'true', podendo assim o usu�rio realizar o login no sistema, funcionalidade dispon�vel apenas aos roles = 'admin'
async function updateStatus(req, res) {
    try {
        const user = req.body;
        const query = "UPDATE users set status = ? WHERE id = ?";
        const connection = await getConnection();
        const [results] = await connection.query(query, [user.status, user.id]);
        connection.release();
        if (results.affectedRows == 0) {
            return res.status(404).json({ message: "ID n�o existente" });
        }
        return res.status(200).json({ message: "Usu�rio atualizado com sucesso" });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// Atualiza os dados do usu�rio (nome, n�mero de contato e senha) de acordo com o email, a senha � salva em hash no banco de dados
async function updateUser(req, res) {
    const user = req.body
    const saltRounds = 10;
    const querySelect = 'SELECT email FROM users WHERE email = ?'
    const queryUpdate = 'UPDATE users set nome = ?, numero_contato = ?, senha = ? WHERE email = ?'

    try {
        const connection = await getConnection();
        const [results] = await connection.query(querySelect, [user.email]);
        connection.release();
        if (results.length === 0) {
            return res.status(404).json({ message: 'Usu�rio n�o encontrado' })
        }
        const hash = await bcrypt.hash(user.senha, saltRounds);
        const [updateResult] = await connection.query(queryUpdate, [user.nome, user.numero_contato, hash, user.email]);
        connection.release();
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Email ou ID n�o encontrado' })
        }
        return res.status(200).json({ message: 'Usu�rio atualizado com sucesso' })
    } catch (err) {
        console.error(err);
        return res.status(500).json(err)
    }    
}

// Check se token do usu�rio � v�lido
async function checarToken(req, res) {
    try {
        return res.status(200).json({ message: "true" });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// Altera senha do usu�rio, a partir da senha antiga e a nova
async function alterarSenha(req, res) {
    const user = req.body
    const email = res.locals.email
    const senhaNova = user.senhaNova

    try {
        const connection = await getConnection();
        let query = "SELECT * FROM users WHERE email = ?"
        const [rows] = await connection.query(query, [email]);
        if (rows.length <= 0) {
            connection.release();
            return res.status(400).json({ message: "Usu�rio n�o encontrado" })
        } else {
            const senhaAtual = rows[0].senha;
            const senhaAntiga = user.senhaAntiga;
            const senhaAtualCorreta = bcrypt.compareSync(senhaAntiga, senhaAtual)

            if (!senhaAtualCorreta) {
                connection.release();
                return res.status(400).json({ message: 'Senha antiga incorreta' })
            } else {
                const senhaNovaHash = bcrypt.hashSync(senhaNova, 10)
                query = "UPDATE users set senha = ? WHERE email = ?"
                const [results] = await connection.query(query, [senhaNovaHash, email]);
                connection.release();
                return res.status(200).json({ message: "Senha alterada com sucesso" })
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

// 'Deleta' usu�rio ('softdelete', atualiza a coluna 'deleted_at' com a data e hor�rio que o usu�rio foi deletado
// e atualiza a coluna deleted_by com o email do usu�rio que deletou), funcionalidade dispon�vel apenas aos roles = 'admin'
async function deleteUser(req, res) {
    try {
        const user = req.body;
        const deletedBy = res.locals.email;

        const query = "UPDATE users SET deleted_at = NOW(), deleted_by = ? WHERE email = ?";
        const connection = await getConnection();
        const [results] = await connection.query(query, [deletedBy, user.email]);
        connection.release();

        if (results.affectedRows == 0) {
            return res.status(404).json({ message: "Email n�o encontrado" });
        }

        return res.status(200).json({ message: "Usu�rio marcado como exclu�do com sucesso" });
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
    updateStatus,
    updateUser,
    checarToken,
    alterarSenha,
    deleteUser
}