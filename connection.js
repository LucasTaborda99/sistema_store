// // Realizando a conexão com o database mysql2, a partir do arquivo .env

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getConnection() {
  const connection = await pool.getConnection();
  return connection;
}

module.exports = getConnection;