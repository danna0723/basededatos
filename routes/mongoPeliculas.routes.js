const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
  peliculasGet,
  peliculaGet,
  peliculasComoGet,
  peliculasPost,
  peliculasPut,
  peliculasDelete
} = require('../controllers/MongoPeliculas.controller')

const router = Router()

// Obtener todas las películas
router.get('/', [validarJWT], peliculasGet)

// Obtener una película por ID
router.get('/:id', [validarJWT], peliculaGet)

// Buscar películas por nombre
router.get('/como/:termino', [validarJWT], peliculasComoGet)

// Crear una nueva película
router.post('/', [validarJWT], peliculasPost)

// Actualizar una película
router.put('/:id', [validarJWT], peliculasPut)

// Eliminar una película
router.delete('/:id', [validarJWT], peliculasDelete)

module.exports = router
