const { response, request } = require('express')
const { Heroes } = require('../models/mySqlHeroes')
const { Op } = require('sequelize')

const heroesGet = async (req, res = response) => {
  try {
    const unosHeroes = await Heroes.findAll()

    res.json({
      ok: true,
      data: unosHeroes
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const heroeIdGet = async (req, res = response) => {
  const { id } = req.params

  try {
    const unHeroe = await Heroes.findByPk(id)

    if (!unHeroe) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un heroe con el id: ' + id
      })
    }

    res.json({
      ok: true,
      data: unHeroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const heroesComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const heroes = await Heroes.findAll({
      attributes: ['nombre', 'bio'],
      where: {
        nombre: {
          [Op.like]: `%${termino}%`
        }
      },
      order: [['nombre', 'ASC']]
    })
    if (heroes.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un heroe con el nombre: ' + termino
      })
    }
    res.json({
      ok: true,
      data: heroes
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error

    })
  }
}

const heroesPost = async (req = request, res = response) => {
  try {
    console.log(req.body)

    const { nombre, bio, img, aparicion, casa } = req.body

    const heroe = new Heroes({ nombre, bio, img, aparicion, casa })

    const existeHeroe = await Heroes.findOne({ where: { nombre } })

    if (existeHeroe) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un Heroe llamado: ' + nombre
      })
    }

    // Guardar en BD
    await heroe.save()

    res.json({
      ok: true,
      mensaje: 'Heroe Creado',
      data: heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const heroePut = async (req = request, res = response) => {
  const { id } = req.params
  const { body } = req

  console.log(id)
  console.log(body)

  try {
    const heroe = await Heroes.findByPk(id)

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un heroe con el id: ' + id
      })
    }

    console.log(body)

    await heroe.update(body)

    res.json({
      ok: true,
      msg: 'Heroe actualizado',
      data: heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const heroeDelete = async (req = request, res = response) => {
  const { id } = req.params

  console.log(id)

  try {
    const heroe = await Heroes.findByPk(id)

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un heroe con el id: ' + id
      })
    }

    // Borrado de la BD
    await heroe.destroy()

    res.json({
      ok: true,
      msj: 'Heroe Borrado..',
      data: heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

module.exports = {
  heroesGet,
  heroeIdGet,
  heroesComoGet,
  heroesPost,
  heroePut,
  heroeDelete
}
