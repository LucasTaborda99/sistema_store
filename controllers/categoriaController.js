// Categoria - Controller 

const connection = require('../connection')

// Cria categoria dos produtos, funcionalidade disponível apenas aos roles = 'admin'
function adicionarCategoria(req, res) {
    const categoria = req.body
    const querySelect = "SELECT COUNT(*) as 'Total de Registros' FROM categoria WHERE nome = ?"
    const queryInsert = "INSERT INTO categoria (nome) VALUES (?)"

    connection.query(querySelect, [categoria.nome], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        }

        const totalDeRegistros = results[0]['Total de Registros']
        if (totalDeRegistros > 0) {
          return res.status(400).json({ message: 'Já existe uma categoria com esse nome' })
        }
        
        connection.query(queryInsert, [categoria.nome], (err, results) => {
            if(err){
                return res.status(500).json(err)
            }
            return res.status(200).json({message: "Categoria adicionada com sucesso"})
        })
    })
}

// Visualiza categoria, ordenando pelo ID
function get(req, res) {
    let query = "SELECT * FROM categoria ORDER BY id"
    connection.query(query, (err, results) => {
        if(err){
            return res.status(500).json(err)
        } else {
            if(results.length <= 0) {
                return res.status(404).json({message: 'Nenhuma categoria encontrada'})
            } else {
                return res.status(200).json(results)
            }
        }
    })
}

// Atualiza categoria pelo ID, funcionalidade disponível apenas aos roles = 'admin'
function update(req, res) {
    const categoria = req.body
    const querySelect = "SELECT COUNT(*) as 'Total de Registros' FROM categoria WHERE nome = ? AND id <> ?"
    const queryUpdate = "UPDATE categoria SET nome = ? WHERE id = ?"

    connection.query(querySelect, [categoria.nome, categoria.id], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        }
        
        const totalDeRegistros = results[0]['Total de Registros']
        if (totalDeRegistros > 0) {
          return res.status(400).json({ message: 'Já existe uma categoria com esse nome' })
        }
        
        connection.query(queryUpdate, [categoria.nome, categoria.id], (err, results) => {
            if(err){
                return res.status(500).json(err)
            } else {
                if(results.affectedRows == 0) {
                     return res.status(404).json({message: "Categoria com esse ID não encontrado"})
                }
                return res.status(200).json({message: "Categoria atualizada com sucesso"})
            }
        })
    })
}

// Deleta categoria pelo ID, funcionalidade disponível apenas aos roles = 'admin'
function deleteCategoria(req, res) {
    let produto = req.body
    query = "DELETE FROM categoria WHERE id = ?"
    connection.query(query, [produto.id], (err, results) => {
        if(err) {
            return res.status(500).json(err)
        } else {
            if(results.affectedRows == 0) {
                return res.status(404).json({message: "Categoria com esse ID não encontrado"})
            } else {
                return res.status(200).json({message: "Categoria deletada com sucesso"})
            }
        }
    })
}

module.exports = {
    adicionarCategoria,
    get,
    update,
    deleteCategoria,
}