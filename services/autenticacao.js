require('dotenv').config()
const jwt = require('jsonwebtoken')

// Este código define um middleware de autenticação de token de acesso usando a biblioteca jsonwebtoken.
const autenticacaoToken = (req, res, next) => {
    const autenticacaoCabecalho = req.headers['authorization']

    // // Dividindo o cabeçalho de autenticação em um array de duas strings, que são "Bearer" e <token>,
    // [1] sendo a segunda parte, ou seja, o Token 
    const token = autenticacaoCabecalho && autenticacaoCabecalho.split(' ')[1]

    // Unauthorized
    if(token == null) {
        return res.sendStatus(401)
    }

    // Verificando se o token é válido e se não expirou
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, response) => {
        if(err) {
            // Forbidden
            return res.sendStatus(403)
        }
            res.locals = {
                ...response,
                email: response.email ? response.email : null,
                role: response.role ? response.role : null
            }
            next()
    })
}

module.exports = { autenticacaoToken: autenticacaoToken }