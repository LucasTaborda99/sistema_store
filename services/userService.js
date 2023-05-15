// userService.js

// Importando da model usuarios a classe Usuario
const { Usuario } = require('../models/index');

// Importando a biblioteca bcrypt, para armazenar senhas como um hash no banco de dados
const bcrypt = require('bcrypt');

// Importando a biblioteca - Moment.js, que permite trabalhar com datas e horários.
const moment = require('moment-timezone');

class UserService {
  async verificarEmailExistente(email) {
    const foundUser = await Usuario.findOne({ where: { email } });
    return foundUser !== null;
  }

  async gerarHashSenha(senha) {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
  }

  async cadastrarUser(nome, numeroContato, email, senha) {
    const existingUsers = await Usuario.findAll();
    const role = existingUsers.length === 0 ? 'admin' : 'user';
    const status = existingUsers.length === 0 ? 'true' : 'false';
    const createdBy = existingUsers.length === 0 ? 'admin' : 'user';
    const createdAt = moment.utc().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
    const dataExpiracao = moment.utc(createdAt).add(1, 'years').format('YYYY-MM-DD HH:mm:ss');
    const hash = await this.gerarHashSenha(senha);

    // Cria um novo usuário na tabela Usuario
    const newUser = await Usuario.create({
      nome: nome,
      numero_contato: numeroContato,
      email: email,
      senha: hash,
      role: role,
      status: status,
      created_by: createdBy,
      created_at: createdAt,
      data_expiracao: dataExpiracao
    });

    return newUser;
  }
}

module.exports = UserService;