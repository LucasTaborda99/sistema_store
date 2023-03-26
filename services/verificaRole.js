require('dotenv').config()

// Este código define um middleware usado para proteger rotas que requerem um papel específico para acessá-las.
// Se um usuário comum (user) tentar acessar uma rota destinada apenas a administradores(admin),
// o middleware enviará uma resposta de 401 (Unauthorized).
const verificaRole = (req, res, next) => {
    if(res.locals.role == process.env.USER)
        // Unauthorized
        res.sendStatus(401)
    else
        next()
}

module.exports = { verificaRole : verificaRole }