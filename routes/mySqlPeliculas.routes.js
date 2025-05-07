const { Router } = require('express')

const {
  peliculasGet,
  peliculaIdGet,
  peliculasComoGet,
  peliculaDelete,
  peliculasPut,
  peliculaPost
} = require('../controllers/MySqlPeliculas.controller')

const router = Router()

router.get('/', peliculasGet)

router.get('/:id', peliculaIdGet)

router.get('/como/:termino', peliculasComoGet)

router.post('/', peliculaPost)

router.put('/:id', peliculasPut)

router.delete('/:id', peliculaDelete)

module.exports = router
