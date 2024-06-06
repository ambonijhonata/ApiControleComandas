const router = require('express').Router()
const clienteController = require('../controllers/clienteController')

router.get('/', clienteController.getAllClientes)
router.get('/', clienteController.getClienteByName)
router.post('/', clienteController.createCliente)
router.put('/:id', clienteController.updateCliente)
router.delete('/:id', clienteController.deleteClient)

module.exports = router
