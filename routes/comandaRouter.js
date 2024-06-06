const router = require('express').Router()
const comandaController = require('../controllers/comandaController')

router.get('/', comandaController.getAllComandas)//se passar a query ?cliente=nome traz a comanda filtrada por cliente
router.post('/', comandaController.createComanda)
router.put('/comanda-produto', comandaController.updateQtdProduto)
router.put('/finalizar-comanda/:id', comandaController.finalizarComanda)
router.put('/:id', comandaController.updateComanda)
router.delete('/:id', comandaController.deleteComanda)
router.post('/comanda-produto', comandaController.inserirProduto)
router.get('/comanda-produto', comandaController.getAllComandasAndProductsByMesa)

module.exports = router