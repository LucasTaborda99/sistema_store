const express = require('express')
let cors = require('cors')
const connection = require('./connection')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json)

module.exports = app