const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  obtenerPaises,
  obtenerPais,
  crearPais,
  actualizarPais,
  borrarPais
} = require('../controllers/MongoPaises.controller');

const router = Router();

router.get('/', obtenerPaises);
router.get('/:id', obtenerPais);
router.post('/', [validarJWT], crearPais);
router.put('/:id', [validarJWT], actualizarPais);
router.delete('/:id', [validarJWT], borrarPais);

module.exports = router;
