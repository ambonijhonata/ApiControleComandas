const express = require('express')

const app = express()
app.use(express.json())

app.use('/categories' ,require('./routes/categoryRoute'))
app.use('/products', require('./routes/productRoute'))
app.use('/clientes', require('./routes/clienteRoute'))
app.use('/mesas', require('./routes/mesaRouter'))
app.use('/comandas', require('./routes/comandaRouter'))

app.listen(3000, () => console.log("Server is running on port 3000"))