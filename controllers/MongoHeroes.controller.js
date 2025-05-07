const { response, request } = require('express')
const { MongoHeroe } = require('../models')
const { now } = require('mongoose')

// Obtener todos los héroes
const heroesGet = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query

  try {
    const [total, heroes] = await Promise.all([
      MongoHeroe.countDocuments(),
      MongoHeroe.find()
        .populate('protagonistas')
        .populate('peliculas')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      total,
      heroes
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener héroes',
      error
    })
  }
}

// Obtener un héroe por ID
const heroeGet = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const heroe = await MongoHeroe.findById(id)
      .populate('protagonistas')
      .populate('peliculas')

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un héroe con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar héroe',
      error
    })
  }
}

// Buscar héroes por nombre
const heroesComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const regex = new RegExp(termino, 'i')

    const heroes = await MongoHeroe.find({
      nombre: regex
    }).select('nombre bio')

    if (heroes.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un héroe que contenga: ${termino}`
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
      msg: 'Error al buscar héroes',
      error
    })
  }
}

// Crear un nuevo héroe
const heroesPost = async (req = request, res = response) => {
  try {
    const { nombre, bio, img, aparicion, casa } = req.body

    // Verificar si existe un héroe con el mismo nombre
    const heroeExiste = await MongoHeroe.findOne({ nombre })

    if (heroeExiste) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe un héroe llamado: ${nombre}`
      })
    }

    // Crear instancia de héroe
    const heroe = new MongoHeroe({
      nombre,
      bio,
      img,
      aparicion,
      casa
    })

    // Guardar en BD
    await heroe.save()

    res.status(201).json({
      ok: true,
      mensaje: 'Héroe creado',
      heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al crear héroe',
      error
    })
  }
}

// Actualizar héroe
const heroesPut = async (req = request, res = response) => {
  const { id } = req.params
  const { ...resto } = req.body

  try {
    resto.fecha_actualizacion = now()

    const heroe = await MongoHeroe.findByIdAndUpdate(id, resto, { new: true })

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un héroe con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      msg: 'Héroe actualizado',
      heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar héroe',
      error
    })
  }
}

// Eliminar héroe
const heroesDelete = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const heroe = await MongoHeroe.findByIdAndDelete(id)

    if (!heroe) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un héroe con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      msg: 'Héroe eliminado',
      heroe
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar héroe',
      error
    })
  }
}

module.exports = {
  heroesGet,
  heroeGet,
  heroesComoGet,
  heroesPost,
  heroesPut,
  heroesDelete
}
