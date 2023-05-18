/* Realizando a conexão com o database mysql2, a partir do arquivo .env,
utilizando o design pattern Singleton */

// Importação do pacote mysql2/promise
const mysql = require('mysql2/promise');

/* Criando a classe Database, o método construtor que seria privado e o
pool com as informações a partir do arquivo .env */
class Database {
  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  // Método estático para obter a instância única da classe Database
  static getInstance() {
    // Verificando se a propriedade instance já está definida
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Método assíncrono para obter uma conexão do pool
  async getConnection() {
    const connection = await this.pool.getConnection();
    return connection;
  }
}

module.exports = Database;