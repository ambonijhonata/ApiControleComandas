const database = require('../services/database')

exports.getAllProducts = async (req, res) => {
    try {
        if(req.query.decription){
            const result = await database.pool.query({
                text: `SELECT P.id, p.name, p.decription, p.price, p.currency, 
                            p.quantity, p.active, p.created_Date, p.updated_date,

                            (SELECT ROW_TO_JSON(category_obj) FROM (
                                SELECT id, name FROM category WHERE id = p.category_id
                            ) category_obj) AS category
    
                        FROM product p
                            WHERE p.description = $1
                    `,
                values: [
                    req.query.decription
                ]
            })

            if(result.rowCount > 0) {
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: 'Mesa nao encontrada'})
            }
        } else {
            const result = await database.pool.query(`
                SELECT P.id, p.name, p.decription, p.price, p.currency, 
                    p.quantity, p.active, p.created_Date, p.updated_date,

                    (SELECT ROW_TO_JSON(category_obj) FROM (
                        SELECT id, name FROM category WHERE id = p.category_id
                    ) category_obj) AS category
        
                FROM product p
                `
            )

            return res.status(200).json(result.rows)
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.createProduct = async (req, res) => {
    try {

        if(!req.body.name){
            return res.status(422).json({ error: 'Name is required' })
        }
        
        if (!req.body.price) {
            return res.status(422).json({ error: 'Price is required' })
        } 
        
        if(!req.body.category_id) {
            return res.status(422).json({ error: 'Category ID is required' })
        } else {     
            const existsResult = await database.pool.query({
                text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
                values: [req.body.category_id]
            })
    
            if(!existsResult.rows[0].exists) {
                return res.status(422).json({error: 'Category id not found'})
            }       
        }

        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM product WHERE name = $1)',
            values: [req.body.name]
        })

        if(existsResult.rows[0].exists) {
            return res.status(409).json({ error: `Product ${req.body.name} already exists`})
        }

        const result = await database.pool.query({
            text: 'INSERT INTO product (name, decription, price, currency, quantity, active, category_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            values: [
                req.body.name,
                req.body.description ? req.body.description : null, 
                req.body.price, 
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id
            ]
        })

        return res.status(201).json(result.rows[0])

    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}

exports.updateProduct = async (req, res) => {
    try { 
        if(!req.body.name) {
            return res.status(422).json({ error: 'Name field is required'})
        }

        if(!req.params.id) {
            return res.status(422).json({ error: 'Id produto e parametro obrigatorio'})
        }

        if(!req.body.price) {
            return res.status(422).json({ error: 'Price field is required'})
        }
console.log(req.body.active)
        if(req.body.active == undefined) {
            return res.status(422).json({ error: 'Active field is required'})
        }

        if(!req.body.category_id) {
            return res.status(422).json({ error: 'category_id field is required'})
        }
        
        const existsResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
            values: [req.body.category_id]
        })

        if(!existsResult.rows[0].exists) {
            return res.status(422).json({error: 'Category id not found'})
        }  

        const result = await database.pool.query({
            text: `
                UPDATE product
                SET name = $1, decription = $2, price = $3, currency = $4, quantity = $5, active = $6, category_id = $7, updated_date = CURRENT_TIMESTAMP
                WHERE id = $8 
                RETURNING *
            `,
            values: [
                req.body.name,
                req.body.decription ? req.body.decription : null, 
                req.body.price, 
                req.body.currency ? req.body.currency : 'USD',
                req.body.quantity ? req.body.quantity : 0,
                'active' in req.body ? req.body.active : true,
                req.body.category_id,
                req.params.id
            ]
        })

        if(result.rowCount == 0) {
            return res.status(404).json( { Error: 'Product not found' })
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}

exports.deleteProduct = async (req, res) => {
    try {        

        const existsLinkComanda = await database.pool.query({
            text: 'SELECT COUNT(*) as quantidade FROM comandas_produtos WHERE id_produto = $1',
            values: [
                req.params.id
            ]
        })

        console.log(existsLinkComanda)

        if(existsLinkComanda.rows[0].quantidade > 0) {
            return res.status(409).json({msg: "Produto vinculado a comandas"})
        }

        const result = await database.pool.query({
            text: 'DELETE FROM product WHERE id = $1',
            values: [req.params.id]
        })

        if(result.rowCount == 0) {
            return res.status(404).json({error: 'Product not found'})
        }

        return res.status(204).send()

    } catch (error) {
        return res.status(500).json({error: error.message})       
    }
}

exports.getProductById = async (req, res) => {
    try {
        const result = await database.pool.query({
            text: `
            SELECT P.id, p.name, p.decription, p.price, p.currency, 
                p.quantity, p.active, p.created_Date, p.updated_date,

                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category

            FROM product p
            WHERE p.id = $1
            `,
            values: [req.params.id]
        })

        if(result.rowCount == 0) {
            return res.status(404).json({error: 'Product not found'})
        }

        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({error: error.message})              
    }
}


exports.getProductByCategoryId = async (req, res) => {
    try {
        const existResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM category WHERE id = $1)',
            values: [req.params.category_id]
        })

        if(!existResult.rows[0].exists){
            return res.status(404).json({ error: 'Category not found' }) 
        }

        const result = await database.pool.query({
            text: `
            SELECT p.id, p.name, p.decription, p.price, p.currency, 
                p.quantity, p.active, p.created_Date, p.updated_date,

                (SELECT ROW_TO_JSON(category_obj) FROM (
                    SELECT id, name FROM category WHERE id = p.category_id
                ) category_obj) AS category

            FROM product p
            WHERE p.category_id = $1
            `,
            values: [req.params.category_id]
        })

        return res.status(200).json(result.rows)        
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}
