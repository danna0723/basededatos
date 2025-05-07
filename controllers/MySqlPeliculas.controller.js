const { response, request } = require('express')
const { Peliculas } = require('../models/mySqlPeliculas')
const { Op } = require('sequelize')

const peliculasGet = async (req, res = response) => {
  try {
    const unasPeliculas = await Peliculas.findAll()

    res.json({
      ok: true,
      data: unasPeliculas
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

const peliculaIdGet = async (req, res = response) => {
  const { id } = req.params

  try {
    const unaPelicula = await Peliculas.findByPk(id)

    if (!unaPelicula) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe una pelicula con el id: ' + id
      })
    }

    res.json({
      ok: true,
      data: unaPelicula
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
const peliculasComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const peliculas = await Peliculas.findAll({
      attributes: ['nombre', 'sinopsis'],
      where: {
        nombre: {
          [Op.like]: `%${termino}%`
        }
      }
    })

    if (Peliculas.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe una pelicula con el nombre: ' + termino
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
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const peliculaPost = async (req = request, res = response) => {
  try {
    console.log(req.body)

    const { nombre, sinopsis, genero, clasificacion, puntuacion } = req.body

    const pelicula = new Peliculas({ nombre, sinopsis, genero, clasificacion, puntuacion })

    const existePelicula = await Peliculas.findOne({ where: { nombre } })

    if (existePelicula) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe la pelicula: ' + existePelicula
      })
    }

    // Guardar en BD
    await pelicula.save()

    res.json({
      ok: true,
      mensaje: 'Pelicula Creado',
      data: pelicula
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

const peliculasPut = async (req = request, res = response) => {
  const { id } = req.params
  const { body } = req

  console.log(id)
  console.log(body)

  try {
    const pelicula = await Peliculas.findByPk(id)

    if (!pelicula) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe una pelicula con el id: ' + id
      })
    }

    console.log(body)

    await pelicula.update(body)

    res.json({
      ok: true,
      msg: 'Heroe actualizado',
      data: pelicula
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

const peliculaDelete = async (req = request, res = response) => {
  const { id } = req.params

  console.log(id)

  try {
    const pelicula = await Peliculas.findByPk(id)

    if (!pelicula) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe una pelicula con el id: ' + id
      })
    }

    // Borrado de la BD
    await pelicula.destroy()

    res.json({
      ok: true,
      msj: 'Pelicula Borrada..',
      data: pelicula
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
  peliculasGet,
  peliculaIdGet,
  peliculasComoGet,
  peliculaPost,
  peliculaDelete,
  peliculasPut
}
