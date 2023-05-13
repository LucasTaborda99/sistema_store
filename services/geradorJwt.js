// Gerador de Token JWT

// Importando a biblioteca - JSON Web Token(JWT), para gerar Token aos usuários ao acessar o sistema
const jwt = require('jsonwebtoken');

class JwtGenerator {
  constructor(secret) {
    this.secret = secret;
  }

  async generateToken(email, role) {
    return jwt.sign({ email, role }, this.secret, { expiresIn: '24h' });
  }
}

module.exports = JwtGenerator;
