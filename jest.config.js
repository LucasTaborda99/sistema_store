const { jestMysqlEnv } = require('jest-mysql');

module.exports = async () => {

  // Configurar as credenciais de acesso ao banco de dados
  await jestMysqlEnv({
    dbName:     process.env.DB_NAME,
    dbUser:     process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost:     process.env.DB_HOST,
    dbPort:     process.env.DB_PORT
  });

  return {
    // Configurações do Jest
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  };
};
