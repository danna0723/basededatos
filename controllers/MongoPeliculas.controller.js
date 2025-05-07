const { response, request } = require('express')
const { MongoPelicula } = require('../models')
const { now } = require('mongoose')

// Obtener todas las películas
const peliculasGet = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query

  try {
    const [total, peliculas] = await Promise.all([
      MongoPelicula.countDocuments(),
      MongoPelicula.find()
        .populate('protagonistas')
        .populate('heroes')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      total,
      peliculas
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener películas',
      error
    })
  }
}

// Obtener una película por ID
const peliculaGet = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const pelicula = await MongoPelicula.findById(id)
      .populate('protagonistas')
      .populate('heroes')

    if (!pelicula) {
      return res.status(404).json({
        ok: false,
        msg: `No existe una película con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      pelicula
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar película',
      error
    })
  }
}

// Buscar películas por nombre
const peliculasComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const regex = new RegExp(termino, 'i')

    const peliculas = await MongoPelicula.find({
      nombre: regex
    }).select('nombre sinopsis')

    if (peliculas.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: `No existe una película que contenga: ${termino}`
      })
    }

    res.json({
      ok: true,
      data: peliculas
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar películas',
      error
    })
  }
}

// Crear una nueva película
const peliculasPost = async (req = request, res = response) => {
  try {
    const { nombre, sinopsis, genero, clasificacion, puntuacion } = req.body

    // Verificar si existe una película con el mismo nombre
    const peliculaExiste = await MongoPelicula.findOne({ nombre })

    if (peliculaExiste) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe una película llamada: ${nombre}`
      })
    }

    // Crear instancia de película
    const pelicula = new MongoPelicula({
      nombre,
      sinopsis,
      genero,
      clasificacion,
      puntuacion
    })

    // Guardar en BD
    await pelicula.save()

    res.status(201).json({
      ok: true,
      mensaje: 'Película creada',
      pelicula
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al crear película',
      error
    })
  }
}

// Actualizar película
const peliculasPut = async (req = request, res = response) => {
  const { id } = req.params
  const { ...resto } = req.body

  try {
    resto.fecha_actualizacion = now()

    const pelicula = await MongoPelicula.findByIdAndUpdate(id, resto, { new: true })

    if (!pelicula) {
      return res.status(404).json({
        ok: false,
        msg: `No existe una película con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      msg: 'Película actualizada',
      pelicula
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar película',
      error
    })
  }
}

// Eliminar película
const peliculasDelete = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const pelicula = await MongoPelicula.findByIdAndDelete(id)

    if (!pelicula) {
      return res.status(404).json({
        ok: false,
        msg: `No existe una película con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      msg: 'Película eliminada',
      pelicula
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar película',
      error
    })
  }
}

module.exports = {
  peliculasGet,
  peliculaGet,
  peliculasComoGet,
  peliculasPost,
  peliculasPut,
  peliculasDelete
}
