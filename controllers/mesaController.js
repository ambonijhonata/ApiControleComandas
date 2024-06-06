const database = require('../services/database')

exports.getAllMesas = async (req, res) => {
    try {

        if(req.query.descricao) {
            const result = await database.pool.query({
                text: 'SELECT * FROM mesas WHERE descricao = $1',
                values: [
                    req.query.descricao
                ]
            })

            if(result.rowCount > 0) {
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: 'Mesa nao encontrada'})
            }
        } else if(req.query.id) {
            const result = await database.pool.query({
                text: 'SELECT * FROM mesas WHERE id = $1',
                values: [
                    req.query.id
                ]
            })

            if(result.rowCount > 0) {
                console.log(result)
                return res.status(200).json(result.rows)
            } else {
                return res.status(404).json({msg: 'Mesa nao encontrada'})
            }
        }
         else {
            const result = await database.pool.query('SELECT ROW_TO_JSON(m) as mesa FROM (SELECT * FROM mesas) m')
            const mesas = result.rows.map(row => row.mesa)
            return res.status(200).json(mesas)
        }
        
    } catch(error) {
        return res.status(500).json({error: error.mesage})
    }
}