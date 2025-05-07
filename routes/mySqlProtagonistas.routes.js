const { Router } = require('express')

const {
  protagonistasGet,
  protagonistaIdGet,
  protagonistasComoGet,
  protagonistasPost,
  protagonistaPut,
  protagonistaDelete
} = require('../controllers/MySqlProtagonistas.controller')

const router = Router()

router.get('/', protagonistasGet)

router.get('/:id', protagonistaIdGet)

router.get('/como/:termino', protagonistasComoGet)

router.post('/', protagonistasPost)

router.put('/:id', protagonistaPut)

router.delete('/:id', protagonistaDelete)

module.exports = router
