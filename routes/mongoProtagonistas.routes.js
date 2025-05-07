const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
  protagonistasGet,
  protagonistaGet,
  protagonistasComoGet,
  protagonistasPost,
  protagonistasPut,
  protagonistasDelete
} = require('../controllers/MongoProtagonistas.controller')

const router = Router()

// Obtener todos los protagonistas
router.get('/', [validarJWT], protagonistasGet)

// Obtener un protagonista por ID
router.get('/:id', [validarJWT], protagonistaGet)

// Buscar protagonistas por nombre
router.get('/como/:termino', [validarJWT], protagonistasComoGet)

// Crear un nuevo protagonista
router.post('/', [validarJWT], protagonistasPost)

// Actualizar un protagonista
router.put('/:id', [validarJWT], protagonistasPut)

// Eliminar un protagonista
router.delete('/:id', [validarJWT], protagonistasDelete)

module.exports = router
