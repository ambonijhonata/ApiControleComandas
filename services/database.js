const { Pool } = require('pg')

const pool = new Pool({
    host: 'aws-0-us-west-1.pooler.supabase.com',
    user: 'postgres',
    password: '@TesteApi2024',
    port: '6543',
    database: 'postgres'
})

module.exports = {
    pool
}