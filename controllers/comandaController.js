const database = require('../services/database')

exports.getAllComandas = async (req, res) => {
    
    try {
        
        if(req.query.cliente) {
            const result = await database.pool.query({
                    text: 'SELECT comandas.id AS id, clientes.nome AS nome_cli, comandas.active, comandas.id_mesa, mesas.descricao FROM comandas ' 
                        + 'INNER JOIN clientes ON clientes.id = comandas.id_cliente '
                        + 'INNER JOIN mesas ON mesas.id = comandas.id_mesa '
                        + 'WHERE clientes.nome = $1',
                    values: [
                        req.query.cliente
                    ]
        });

        if(result.rowCount > 0) {
            return res.status(200).json(result.rows)
        } else {
            return res.status(404).json({msg: 'Comanda nao encontrada'})
        }

        } else if(req.query.id) {
            const result = await database.pool.query({
                text: 'SELECT comandas.id AS id, clientes.nome AS nome_cli, comandas.active, comandas.id_mesa, mesas.descricao FROM comandas ' 
                    + 'INNER JOIN clientes ON clientes.id = comandas.id_cliente '
                    + 'INNER JOIN mesas ON mesas.id = comandas.id_mesa '
                    + 'WHERE comandas.id = $1',
                values: [
                    req.query.id
                ]
            });

            if(result.rowCount > 0) {
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: 'Comanda nao encontrada'})
            }
        } else if (req.query.id_mesa) {
            const result = await database.pool.query({
                text: 'SELECT comandas.id AS id, clientes.nome AS nome_cli, comandas.active, comandas.id_mesa, mesas.descricao FROM comandas ' 
                    + 'INNER JOIN clientes ON clientes.id = comandas.id_cliente '
                    + 'INNER JOIN mesas ON mesas.id = comandas.id_mesa '
                    + 'WHERE comandas.id_mesa = $1 AND comandas.active = 1',
                values: [
                    req.query.id_mesa
                ]
            });

            if(result.rowCount > 0) {
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: 'Comanda nao encontrada'})
            }
        }
         else {
            const result = await database.pool.query(`
                    SELECT comandas.id AS id, clientes.nome AS nome_cli, comandas.active, comandas.id_mesa, mesas.descricao
                    FROM comandas
                    INNER JOIN clientes ON clientes.id = comandas.id_cliente
                    INNER JOIN mesas ON mesas.id = comandas.id_mesa
                `);
        
            return res.status(200).json(result.rows)
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.getComandasByClient = async (req, res) => {
    try {
        console.log(req.query.cliente)
        const result = await database.pool.query({
            text: `
                SELECT 
                    c.id AS comanda_id,
                    (
                        SELECT ROW_TO_JSON(cl)
                        FROM (
                            SELECT cl.nome
                            FROM clientes cl
                            WHERE cl.id = c.id_cliente
                        ) cl
                    ) AS cliente,
                    (
                        SELECT ROW_TO_JSON(p)
                        FROM (
                            SELECT p.name
                            FROM product p
                            WHERE p.id = cp.id_produto
                        ) p
                    ) AS produto
                FROM 
                    comandas_produtos cp
                JOIN 
                    comandas c ON cp.id_comanda = c.id
                JOIN 
                    clientes cl ON c.id_cliente = cl.id
                JOIN 
                    product p ON cp.id_produto = p.id
                WHERE cl.nome = $1;
        `,
        values: [req.params.cliente]})

        return res.status(200).json(result.rows)
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

exports.createComanda = async (req, res) => {
    try {
        if(!req.body.id_cliente) {
            return res.status(422).json({ error: 'id_cliente is required' })
        }

        if(!req.body.id_mesa) {
            return res.status(422).json({ error: 'id_mesa is required' })
        }

        const existResult = await database.pool.query({
            text: 'SELECT EXISTS(SELECT * FROM clientes WHERE id = $1)',
            values: [req.body.id_cliente]
        })

        if(!existResult.rows[0].exists) {
            return res.status(422).json({error: 'Cliente nao existe'})
        }
        
        const existMesaResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM mesas WHERE id = $1)',
            values: [
                req.body.id_mesa
            ]
        })

        if(!existMesaResult.rows[0].exists) {
            return res.status(404).json("Mesa nao existe")
        }

        const result = await database.pool.query({
            text: 'INSERT INTO comandas (id_cliente, active, id_mesa) VALUES ($1, $2, $3) RETURNING *',
            values: [
                req.body.id_cliente,
                1,
                req.body.id_mesa
            ]
        })

        return res.status(201).json(result.rows[0])
    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}

exports.updateComanda = async (req, res) => {
    try {        
        if(!req.params.id) {
            return res.status(422).json({error: 'ID da comanda é obrigatorio'})
        }

        if(!req.body.id_cliente){
            return res.status(422).json({error: 'id_cliente da comanda é obrigatorio'})
        }        
        console.log(req.body.active)
        if(req.body.active === undefined || req.body.active === null){
            return res.status(422).json({error: 'active da comanda é obrigatorio'})
        }

        if(!req.body.id_mesa){
            return res.status(422).json({error: 'id_mesa da comanda é obrigatorio'})
        }

        const existComandaResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM comandas WHERE id = $1)',
            values: [
                req.params.id
            ]
        })

        if(!existComandaResult.rows[0].exists) {
            return res.status(404).json("Comanda nao existe")
        }

        const existClienteResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM clientes WHERE id = $1)',
            values: [
                req.body.id_cliente
            ]
        })

        if(!existClienteResult.rows[0].exists) {
            return res.status(404).json("cliente nao existe")
        }

        const existMesaResult = await database.pool.query({
            text: 'SELECT EXISTS (SELECT * FROM mesas WHERE id = $1)',
            values: [
                req.body.id_mesa
            ]
        })

        if(!existMesaResult.rows[0].exists) {
            return res.status(404).json("Mesa nao existe")
        }

        const result = await database.pool.query({
            text: `
                UPDATE comandas
                SET id_cliente = $1,
                    active = $2,
                    id_mesa = $3
                WHERE id = $4
            `,
            values: [
                req.body.id_cliente,
                req.body.active,
                req.body.id_mesa,
                req.params.id
            ]

        })

        if(result.rowCount == 0) {
            return res.status(404).json("Comanda nao existe")
        }
        
        return res.status(200).json(result.rows[0])
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}

exports.deleteComanda = async (req, res) => {
    try {
        const existsLinkComandaProduto = await database.pool.query({
            text: 'SELECT COUNT(*) as quantidade FROM comandas_produtos WHERE id_comanda = $1',
            values: [
                req.params.id
            ]
        })

        if(existsLinkComandaProduto.rows[0].quantidade > 0) {
            return res.status(409).json("Comanda vinculada a produtos.")            
        }

        const result = await database.pool.query({
            text: 'DELETE FROM comandas WHERE id = $1',
            values: [
                req.params.id
            ]
        })

        if(result.rowCount == 0) {
            return res.status(404).json({error: 'Comanda nao encontrada'})
        }

        return res.status(204).send()
    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}

exports.inserirProduto = async (req, res) => {
    try {
        if(!req.body.id_comanda) {
            return res.status(422).json({ error: 'id_comanda is required' })
        }

        const existsComanda = await database.pool.query({
            text: 'SELECT COUNT(*) AS quantidade FROM comandas WHERE id = $1',
            values: [
                req.body.id_comanda
            ]
        })

        if(existsComanda.rows[0].quantidade == 0) {
            return res.status(400).json({msg: 'Comanda nao existe'})
        }
        
        if(!req.body.produtos) {
            return res.status(422).json({ error: 'produtos[] is required' })
        }
        
        for(const produto of req.body.produtos) {            
            const existsProduto = await database.pool.query({
                text: 'SELECT COUNT(*) AS quantidade from product WHERE id = $1',
                values: [
                    produto.id_produto
                ]
            })

            if(existsProduto.rows[0].quantidade == 0){
                return res.status(400).json({msg: "Produto " + produto.id_produto + " nao existe"})
            }                    

        }

        

        for(const produto of req.body.produtos) {                                            
            //percorre o array e verifica se tem vinculo
            //se tem vinculo faz um update where idcomanda e idproduto settando a quantidade, se não insere

            const existsVinculo = await database.pool.query({
                text: 'SELECT COUNT(*) AS quantidade FROM comandas_produtos WHERE id_comanda = $1 AND id_produto = $2',
                values: [
                    req.body.id_comanda,
                    produto.id_produto
                ]
            })

            
            if(existsVinculo.rows[0].quantidade > 0) {                
                const update = await database.pool.query({
                    text: 'UPDATE comandas_produtos SET qtd_produto = $1 WHERE id_comanda = $2 AND id_produto = $3',
                    values: [
                        produto.quantidade,
                        req.body.id_comanda,
                        produto.id_produto
                    ]
                })
                
                console.log({
                    text: 'UPDATE comandas_produtos SET qtd_produto = $1 WHERE id_comanda = $2 AND id_produto = $3',
                    values: [
                        produto.quantidade,
                        req.body.id_comanda,
                        produto.id_produto
                    ]
                })
                
            } else {
                const result = await database.pool.query({
                    text: 'INSERT INTO comandas_produtos (id_comanda, id_produto, qtd_produto) VALUES ($1, $2, $3) RETURNING *',
                    values: [
                        req.body.id_comanda,
                        produto.id_produto,
                        produto.quantidade
                    ]
                })
                
            }                         
                
        }        

        return res.status(201).send()
    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}

exports.updateQtdProduto = async (req, res) => {
    try {
        
        if(!req.body.id_comanda) {
            return res.status(422).json({ error: 'id_comanda is required' })
        }
        
        if(!req.body.produtos) {
            return res.status(422).json({ error: 'produtos[] is required' })
        }

        const isExistLinkComandaProduto = false;
        for(const produto of req.body.produtos) {
            const existLinkComandaProduto = await database.pool.query({
                text: 'SELECT COUNT(*) AS quantidade FROM comandas_produtos WHERE id_comanda = $1 AND id_produto = $2',
                values: [
                    req.body.id_comanda,
                    produto.id_produto
                ]
            })
            
            console.log(existLinkComandaProduto.rows[0].quantidade)
            if(existLinkComandaProduto.rows[0].quantidade == 0) {
                return res.status(400).json("Comanda ou produto não encontrado.")
            }
        }                

        for(const produto of req.body.produtos) {
            const update = await database.pool.query({
                text: 'UPDATE comandas_produtos SET qtd_produto = $1 WHERE id_comanda = $2 AND id_produto = $3',
                values: [
                    produto.quantidade,
                    req.body.id_comanda,
                    produto.id_produto
                ]
            })

            if(update.rowCount == 0) {
                return res.status(404).json({error: 'Nao foi possivel editar.'})
            }
        }

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}

exports.getAllComandasAndProductsByMesa = async (req, res) => {
    try {

        //se tiver aquery traz por mesa, se não traz todas as ativas
        if(req.query.id_mesa) {
            const result = await database.pool.query({
                text: `
                WITH ComandaTotais AS (
                    SELECT cp.id_comanda, SUM(p.price * cp.qtd_produto) AS total_comanda 
                    FROM comandas_produtos cp 
                    INNER JOIN product p ON cp.id_produto = p.id 
                    GROUP BY cp.id_comanda
                )
                SELECT cp.id_comanda AS id_comanda, 
                       cm.id_cliente AS id_cliente, 
                       cl.nome AS nome_cli, 
                       cm.active, 
                       cm.id_mesa AS id_mesa, 
                       m.descricao, 
                       cp.id_produto AS id_produto, 
                       p.name AS nome_produto, 
                       p.price, 
                       cat.name AS categoria, 
                       cp.qtd_produto, 
                       (p.price * cp.qtd_produto) AS total_por_produto,
                       ct.total_comanda
                FROM comandas_produtos cp 
                INNER JOIN comandas cm ON cm.id = cp.id_comanda 
                INNER JOIN clientes cl ON cm.id_cliente = cl.id 
                INNER JOIN mesas m ON cm.id_mesa = m.id 
                INNER JOIN product p ON cp.id_produto = p.id 
                INNER JOIN category cat ON p.category_id = cat.id 
                INNER JOIN ComandaTotais ct ON cp.id_comanda = ct.id_comanda 
                WHERE m.id = $1 AND cm.active = 1;
                `,
                values: [
                    req.query.id_mesa
                ]
            })

            res.status(200).json(result.rows)

        } else if(req.query.id_comanda) {
            const result = await database.pool.query({
                text: `
                WITH ComandaTotais AS (
                    SELECT cp.id_comanda, SUM(p.price * cp.qtd_produto) AS total_comanda 
                    FROM comandas_produtos cp 
                    INNER JOIN product p ON cp.id_produto = p.id 
                    GROUP BY cp.id_comanda
                )
                SELECT cp.id_comanda AS id_comanda, 
                       cm.id_cliente AS id_cliente, 
                       cl.nome AS nome_cli, 
                       cm.active, 
                       cm.id_mesa AS id_mesa, 
                       m.descricao, 
                       cp.id_produto AS id_produto, 
                       p.name AS nome_produto, 
                       p.price, 
                       cat.name AS categoria, 
                       cp.qtd_produto, 
                       (p.price * cp.qtd_produto) AS total_por_produto,
                       ct.total_comanda
                FROM comandas_produtos cp 
                INNER JOIN comandas cm ON cm.id = cp.id_comanda 
                INNER JOIN clientes cl ON cm.id_cliente = cl.id 
                INNER JOIN mesas m ON cm.id_mesa = m.id 
                INNER JOIN product p ON cp.id_produto = p.id 
                INNER JOIN category cat ON p.category_id = cat.id 
                INNER JOIN ComandaTotais ct ON cp.id_comanda = ct.id_comanda 
                WHERE cp.id_comanda = $1 AND cm.active = 1;
                `,
                values: [
                    req.query.id_comanda
                ]
            })

            res.status(200).json(result.rows)
        }
        
        else {
            const result = await database.pool.query(
                  "WITH ComandaTotais AS ( "
                + "SELECT cp.id_comanda, SUM(p.price * cp.qtd_produto) AS total_comanda "
                + "FROM comandas_produtos cp "
                + "INNER JOIN product p ON cp.id_produto = p.id "
                + "GROUP BY cp.id_comanda) "
                + "SELECT cp.id_comanda AS id_comanda, cm.id_cliente AS id_cliente, "
                + "cl.nome AS nome_cli, cm.active, cm.id_mesa AS id_mesa, m.descricao, "
                + "cp.id_produto AS id_produto, p.name AS nome_produto, p.price, "
                + "cat.name AS categoria, cp.qtd_produto, (p.price * cp.qtd_produto) AS total_por_produto, "
                + "ct.total_comanda "
                + "FROM comandas_produtos cp "
                + "INNER JOIN comandas cm ON cm.id = cp.id_comanda "
                + "INNER JOIN clientes cl ON cm.id_cliente = cl.id "
                + "INNER JOIN mesas m ON cm.id_mesa = m.id "
                + "INNER JOIN product p ON cp.id_produto = p.id "
                + "INNER JOIN category cat ON p.category_id = cat.id "
                + "INNER JOIN ComandaTotais ct ON cp.id_comanda = ct.id_comanda "
                + "WHERE cm.active = 1"
            
            )

            res.status(200).json(result.rows)
        }
    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}

exports.finalizarComanda = async (req, res) => {
    try {
        if(!req.params.id) {
            return res.status(400).json( {error: "ID da comanda e obrigatorio como parametro da URL."})
        }

        const result = await database.pool.query({
            text: `UPDATE comandas SET active = 0 WHERE id = $1`,
            values: [
                req.params.id
            ]           
        })
        
        if(result.rowCount == 0) {
            console.log("chegou")
            return res.status(404).json( { Error: 'Comanda not found' })
        }

        return res.status(200).json(result.rows[0])
    } catch (error) {
        return res.status(500).json( {error: error.message})
    }
}