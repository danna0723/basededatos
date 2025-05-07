const { Router } = require('express')

const { validarJWT } = require('../middlewares/validar-jwt')

const {
  usuariosGet,
  // usuariosPut,
  usuariosPost
  // usuariosDelete
} = require('../controllers/mongoUsuario.controller')

const router = Router()

router.get('/', [validarJWT], usuariosGet)

router.post('/', usuariosPost)

module.exports = router
