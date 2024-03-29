//  User Controller

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('../connection');

// Importando da model usuarios a classe Usuario
const { Usuario } = require('../models/index');

// Importando a biblioteca bcryptjs, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcryptjs');

// Improtando a biblioteca crypto, para gerar uma sequência de caracteres aleatórios
const crypto = require('crypto');

// Importando a biblioteca - Nodemailer, para mandar email através do objeto "transportador"
const nodemailer = require('nodemailer');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');

// Carregando as variáveis de ambiente definidas no arquivo .env
require('dotenv').config();

// Importando o módulo jwtGenerator.js que está localizada na pasta services
const JwtGenerator = require('../services/geradorJwt');

// Importando o módulo userService.js que está localizada na pasta services
const UserService = require('../services/UserService');

// Cadastra um usuário, com status default 'false' e role 'user' (caso não seja o primeiro usuário cadastrado no banco de dados) e salvando a senha em formato de hash no banco de dados
async function cadastrarUsuarios(req, res) {
  try {
    const { nome, numero_contato, email, senha } = req.body;

     // Criando uma nova instância da classe UserService
    const userService = new UserService();

    // Chamando o método verificarEmailExistente da instância de userService, passando o email do usuário como parâmetro
    const emailExistente = await userService.verificarEmailExistente(email);
    if (emailExistente) {
      return res.status(400).json({ message: "Email já existente" });
    }

    // Cadastrando o usuário utilizando o serviço UserService e o método cadastrarUser com seus devidos parâmetros
    await userService.cadastrarUser(nome, numero_contato, email, senha);

    return res.status(200).json({ message: "Usuário registrado com sucesso" });
  } catch (err) {
    return res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
}

/* Realiza o login de um usuário, por email e senha, após aprovação do role = 'admin',
mudando o status do usuário para 'true', será permitido o login desse usuário ao sistema,
gerando um token jwt ao usuário, válido por 24 horas */
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

      // Verifica se a senha expirou, de acordo com a data atual
      const currentDate = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
      const expirationDate = moment.utc(foundUser.data_expiracao).format('YYYY-MM-DD HH:mm:ss');
      if (moment(currentDate).isAfter(expirationDate)) {
        return res.status(401).json({ message: "A senha expirou. Por favor, solicite uma nova senha." });
      }
      
      // Criando uma nova instância da classe JwtGenerator, passando como parâmetro o valor da variável de ambiente ACCESS_TOKEN, definida no arquivo .env
      const jwtGenerator = new JwtGenerator(process.env.ACCESS_TOKEN);

      // Chamando o método generateToken da instância de JwtGenerator, passando o email do usuário autenticado e o role
      const accessToken = await jwtGenerator.generateToken(email, foundUser.role);
  
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
        console.log("O servidor está pronto para receber nossas mensagens!");
    } else {
        console.log(error);
    }
})

// Envia nova senha com 6 caracteres ao email do usuário de acordo com o usuário e email dele,
// senha nova com validade de 30 min
async function esqueciSenha(req, res) {
    try {
        const { nome, email } = req.body;
        const saltRounds = 10;
        const foundUser = await Usuario.findOne({ where: { nome, email } });
        const date = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const expirationDate = moment.utc(date).add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');

        if (!foundUser) {
            return res.status(200).json({ message: "Sua pesquisa não retornou nenhum resultado. Por favor tente novamente com outra informação" });
        } else {
            // gera uma senha aleatória de 6 caracteres
            const newPassword = crypto.randomInt(100000, 1000000).toString(16).padStart(6, '0');

            // Criptografar a senha
            const hash = await bcrypt.hash(newPassword, saltRounds);

            // Atualiza a senha e a data de expiração do usuário no banco de dados
            foundUser.senha = hash;
            foundUser.data_expiracao = expirationDate;
            await foundUser.save();

            // Corpo do e-mail formatado com HTML e CSS embutidos
            let emailCorpo = {
                from: process.env.EMAIL,
                to: foundUser.email,
                subject: 'SistemaStore - Recuperação de senha',
                html: `
                <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #1f9ee7;">Recuperação de senha do SistemaStore</h2>
                  <p style="font-size: 16px; color: #333;">Olá, <strong style="font-weight: bold;">${foundUser.nome}</strong></p>
                  <p style="font-size: 16px; color: #333;">Conforme solicitado, segue sua senha provisória para acesso ao SistemaStore:</p>
                  <p style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Seus detalhes de login ao SistemaStore:</strong></p>
                  <ul style="list-style-type: none; padding-left: 20px;">
                    <li style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Usuário:</strong> ${foundUser.nome}</li>
                    <li style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Email:</strong> ${foundUser.email}</li>
                    <li style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Nova senha:</strong> ${newPassword}</li>
                  </ul>
                  <p style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Observação:</strong> A nova senha gerada é válida apenas por <strong>30 minutos</strong>. Acesse o SistemaStore e altere sua senha.</p>
                  <p style="font-size: 16px; color: #333;"><strong style="font-weight: bold;">Se você já recebeu esse código ou não precisa mais dele, desconsidere este e-mail.</strong></p>
                  <p style="font-size: 16px; color: #333;">Clique <a href="http://localhost:4200/" style="color: #007bff; text-decoration: none;">aqui</a> para realizar login.</p>
                  <p style="font-size: 16px; color: #333;">Atenciosamente,</p>
                  <p style="font-size: 16px; font-weight: bold; color: #333;">Equipe do SistemaStore</p>
                </div>
              `,
              // Estilos CSS embutidos para formatar o texto
              css: `
                p {
                  font-size: 16px;
                  color: #333;
                  margin-bottom: 10px;
                }
                strong {
                  font-weight: bold;
                }
                ul {
                  list-style-type: none;
                  padding-left: 20px;
                }
                a {
                  color: #007bff;
                  text-decoration: none;
                }
              `
            };

            await transportador.sendMail(emailCorpo);
            return res.status(200).json({ message: "Nova senha enviada com sucesso para o seu email" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Erro ao recuperar senha" });
    }
}

// Visualiza todos os usuários com suas informações e que não foram deletados, essa função só está disponível aos roles = 'admin'
async function get(req, res) {
    try {
      const users = await Usuario.findAll({
        attributes: ['id', 'nome', 'numero_contato', 'email', 'status', 'role'],
        where: { deleted_at: null}
      });
      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
}

// Atualiza o status dos usuários, de 'false' para 'true' ou vice-versa, podendo assim o usuário realizar o login no sistema, funcionalidade disponível apenas aos roles = 'admin', e também sendo
// possível atualizar o role do usuário de 'user' para 'admin' ou vice-versa
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

    // Adicionando um console.log para visualizar a data antes da atualização
    console.log("updated_at before update:", user.updated_at);

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
        const db = Database.getInstance();
        const connection = await db.getConnection();

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
    const senhaNova = user.newPassword

        const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
        const dataExpiracao = moment.utc(createdAt).add(1, 'years').format('YYYY-MM-DD HH:mm:ss');

    try {
        const db = Database.getInstance();
        const connection = await db.getConnection();

        let query = "SELECT * FROM usuarios WHERE email = ?"
        const [rows] = await connection.query(query, [email]);
        if (rows.length <= 0) {
            connection.release();
            return res.status(400).json({ message: "Usuário não encontrado" })
        } else {
            const senhaAtual = rows[0].senha;
            const senhaAntiga = user.oldPassword;
            console.log('senhaAntiga:', senhaAntiga);
            console.log('senhaAtual:', senhaAtual);

            const senhaAtualCorreta = bcrypt.compareSync(senhaAntiga, senhaAtual)

            if (!senhaAtualCorreta) {
                connection.release();
                return res.status(400).json({ message: 'Senha atual incorreta' })
            } else {
                const senhaNovaHash = bcrypt.hashSync(senhaNova, 10)
                query = "UPDATE usuarios set senha = ?, updated_at = NOW(), updated_by = ?, data_expiracao = ? WHERE email = ?"
                const [results] = await connection.query(query, [senhaNovaHash, email, dataExpiracao, email]);
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

        const db = Database.getInstance();
        const connection = await db.getConnection();

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