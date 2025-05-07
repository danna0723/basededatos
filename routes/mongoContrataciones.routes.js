const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  obtenerContratacionesJugador,
  crearContratacion,
  actualizarContratacion,
  eliminarContratacion,
  obtenerContrataciones ,
} = require('../controllers/mongoContrataciones.controller');

const router = Router();

// Obtener todas las contrataciones de un jugador específico
router.get('/:id', [validarJWT], obtenerContratacionesJugador);

router.get('/', obtenerContrataciones);

// Crear una nueva contratación
router.post('/', [validarJWT], crearContratacion);

// Actualizar una contratación por ID
router.put('/:id', [validarJWT], actualizarContratacion);

// Eliminar una contratación (marcar como inactiva) por ID
router.delete('/:id', [validarJWT], eliminarContratacion);

module.exports = router;
