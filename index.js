// Criando o index.js, aqui será chamado todas as rotas do sistema

const express = require('express')
let cors = require('cors')
const userRoute = require('./routes/user')
const categoriaRoute = require('./routes/categoria')
const produtoRoute = require('./routes/produtos')
const dashboardRoute = require('./routes/dashboard')
const fornecedorRoute = require('./routes/fornecedor')
const clientesRoute = require('./routes/clientes')
const vendasRoute = require('./routes/vendas')
const comprasRoute = require('./routes/compras')
const controleEstoqueRoute = require('./routes/controleEstoque')

const app = express()
const { sequelize } = require('./models');

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRoute)
app.use('/categoria', categoriaRoute)
app.use('/produto', produtoRoute)
app.use('/dashboard', dashboardRoute)
app.use('/fornecedor', fornecedorRoute)
app.use('/clientes', clientesRoute)
app.use('/vendas', vendasRoute)
app.use('/compras', comprasRoute)
app.use('/controleEstoque', controleEstoqueRoute)

// Importando o módulo connection, responsável por estabelecer conexão com o banco de dados
const Database = require('./connection');

// Inicializando a conexão do sequelize com o banco de dados
sequelize.authenticate()
  .then(() => {
    console.log('Conexão do Sequelize com o banco de dados estabelecida com sucesso!');
  })
  .catch((error) => {
    console.error('Erro ao conectar o Sequelize com o banco de dados:', error);
  });

// Inicializando a conexão com o banco de dados
(async () => {
  try {
    const db = Database.getInstance();
    const connection = await db.getConnection();
    
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    connection.release();
  } catch (err) {
    console.error('Erro ao conectar-se ao banco de dados:', err);
  }
})();

module.exports = app