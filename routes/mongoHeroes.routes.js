const { Router } = require('express')
const { validarJWT } = require('../middlewares/validar-jwt')
const {
  heroesGet,
  heroeGet,
  heroesComoGet,
  heroesPost,
  heroesPut,
  heroesDelete
} = require('../controllers/MongoHeroes.controller')

const router = Router()

// Obtener todos los héroes
router.get('/', [validarJWT], heroesGet)

// Obtener un héroe por ID
router.get('/:id', [validarJWT], heroeGet)

// Buscar héroes por nombre
router.get('/como/:termino', [validarJWT], heroesComoGet)

// Crear un nuevo héroe
router.post('/', [validarJWT], heroesPost)

// Actualizar un héroe
router.put('/:id', [validarJWT], heroesPut)

// Eliminar un héroe
router.delete('/:id', [validarJWT], heroesDelete)

module.exports = router
