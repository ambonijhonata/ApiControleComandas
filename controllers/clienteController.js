const database = require('../services/database')

exports.getAllClientes = async (req, res) => {
    try {                        
        const teste = "SELECT * FROM clientes WHERE nome = " + req.query.nome
        console.log(teste)
        if(req.query.nome) {
            const result = await database.pool.query({
                text: 'SELECT * FROM clientes WHERE nome = $1',            
                values: [
                    req.query.nome
                ]
            })

            console.log(req.query.nome)
            
            if(result.rows != null){
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: "Client not found"})
            }
        } else {
                        
            const result = await database.pool.query(`
                SELECT *
                FROM clientes
                `
            )

            return res.status(200).json(result.rows)
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.getClienteByName = async (req, res) => {
    try {

        if(req.query.nome) {
            const result = await database.pool.query({
                text: 'SELECT * FROM clientes WHERE nome = $1',            
                values: [
                    req.params.nome
                ]
            })

            return res.status(200).json(result.rows)
        } else {
            return res.status(400).send({msg: 'Nome não fornecido'})
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.createCliente = async (req, res) => {
    try {
        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required' })
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM clientes WHERE nome = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists) {
            return res.status(409).json({ error: `Cliente ${req.body.name} already exists`})
        }

        const result = await database.pool.query({
            text: 'INSERT INTO public.clientes(nome) VALUES ($1) RETURNING *',
            values: [
                req.body.name
            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.updateCliente = async (req, res) => {
    try {
        if(!req.body.name) {
            return res.status(422).json({ error: 'Name is required'})
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM clientes WHERE id = $1)',
            values: [req.params.id]
        })

        if(!existsResult.rows[0].exists) {
            return res.status(409).json("client not found")
        }

        const result = await database.pool.query({
            text: `
                UPDATE clientes
                SET nome = $1
                WHERE id = $2
                RETURNING *
            `,
            values :[
                req.body.name,
                req.params.id
            ]
        })

        if(result.rowCount == 0) {
            return res.status(404).json( { Error: 'Cliente not found' })
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}

exports.deleteClient = async (req, res) => {
    try {    
        
        const existsLinkComanda = await database.pool.query({
            text: 'SELECT COUNT(*) AS quantidade FROM comandas WHERE id_cliente = $1',
            values: [req.params.id]
        })                

        if(existsLinkComanda.rows[0].quantidade > 0) {
            return res.status(409).json("Cliente vinculado a uma comanda, delete todas as comandas desse cliente anteriormente.")
        }

        const result = await database.pool.query({
            text: 'DELETE FROM clientes WHERE id = $1',
            values: [req.params.id]
        })

        if(result.rowCount == 0) {
            return res.status(404).json({error: 'Client not found'})
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({error: error.message})       
    }
}