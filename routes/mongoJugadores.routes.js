const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
  obtenerJugadores,
  obtenerJugador,
  obtenerJugadoresEquipo,
  obtenerJugadoresPais,
  obtenerContratacionesJugador, 
  jugadoresPost,
  actualizarJugador,
  borrarJugador,
} = require('../controllers/MongoJugadores.controller');

const router = Router();

// Obtener todos los jugadores
router.get('/', [validarJWT], obtenerJugadores);

// Obtener un jugador por ID
router.get('/:id', [validarJWT], obtenerJugador);

// Obtener las contrataciones de un jugador por ID
router.get('/:id/contrataciones', [validarJWT], obtenerContratacionesJugador);  // Nueva ruta

// Obtener jugadores por equipo
router.get('/equipo/:id', [validarJWT], obtenerJugadoresEquipo);

// Obtener jugadores por país
router.get('/pais/:id', [validarJWT], obtenerJugadoresPais);

// Crear un nuevo jugador
router.post('/', [validarJWT], jugadoresPost );

// Actualizar un jugador por ID
router.put('/:id', [validarJWT], actualizarJugador);

// Eliminar un jugador (marcar como inactivo) por ID
router.delete('/:id', [validarJWT], borrarJugador);

module.exports = router;
