const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
  equiposGet,
  equipoGet,
  equiposPost,
  equiposPut,
  equiposDelete
} = require('../controllers/MongoEquipos.controller')

const router = Router()

router.get('/', [validarJWT], equiposGet)
router.get('/:id', [validarJWT], equipoGet)
router.post('/', [validarJWT], equiposPost)
router.put('/:id', [validarJWT], equiposPut)
router.delete('/:id', [validarJWT], equiposDelete)

module.exports = router
