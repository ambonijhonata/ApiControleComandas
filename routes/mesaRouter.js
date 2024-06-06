const router = require('express').Router()
const mesaController = require('../controllers/mesaController')

router.get('/', mesaController.getAllMesas)

module.exports = router