require('dotenv').config()

const checkingRole = (req, res, next) => {
    if(res.locals.role == process.env.USER)
        res.sendStatus(401)
    else
        next()
}

module.exports = { checkingRole : checkingRole }