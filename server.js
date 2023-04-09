// Criando Servidor
require('dotenv').config()
process.env.TZ = 'America/Sao_Paulo';

const http = require('http')
const app = require('./index')

const server = http.createServer(app)
server.listen(process.env.PORT)