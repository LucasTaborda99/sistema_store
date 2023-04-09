// Criando o index.js, aqui será chamado todas as rotas do sistema
const express = require('express')
let cors = require('cors')
const userRoute = require('./routes/user')
const categoriaRoute = require('./routes/categoria')
const app = express()
const { sequelize } = require('./models');

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRoute)
app.use('/categoria', categoriaRoute)

// Inicialize a conexão com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao conectar-se ao banco de dados:', error);
  });

module.exports = app