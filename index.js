// Criando o index.js, aqui será chamado todas as rotas do sistema
const express = require('express')
let cors = require('cors')
const userRoute = require('./routes/user')
const categoriaRoute = require('./routes/categoria')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/user', userRoute)
app.use('/categoria', categoriaRoute)

module.exports = app