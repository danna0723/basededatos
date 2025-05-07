const { response, request } = require('express')
const { MongoProtagonista, MongoHeroe, MongoPelicula } = require('../models')
const { now } = require('mongoose')

// Obtener todos los protagonistas
const protagonistasGet = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query

  try {
    const [total, protagonistas] = await Promise.all([
      MongoProtagonista.countDocuments(),
      MongoProtagonista.find()
        .populate('heroes')
        .populate('peliculas')
        .skip(Number(desde))
        .limit(Number(limite))
    ])

    res.json({
      total,
      protagonistas
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener protagonistas',
      error
    })
  }
}

// Obtener un protagonista por ID
const protagonistaGet = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const protagonista = await MongoProtagonista.findById(id)
      .populate('heroes')
      .populate('peliculas')

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un protagonista con el id: ${id}`
      })
    }

    res.json({
      ok: true,
      protagonista
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar protagonista',
      error
    })
  }
}

// Buscar protagonistas por nombre
const protagonistasComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const regex = new RegExp(termino, 'i')

    const protagonistas = await MongoProtagonista.find({
      nombre: regex
    }).select('nombre rol')

    if (protagonistas.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un protagonista que contenga: ${termino}`
      })
    }

    res.json({
      ok: true,
      data: protagonistas
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar protagonistas',
      error
    })
  }
}

// Crear un nuevo protagonista
const protagonistasPost = async (req = request, res = response) => {
  try {
    const { nombre, rol, descripcionRol, fecha, peliculaId, heroeId } = req.body

    // Verificar si existe un protagonista con el mismo nombre
    const protagonistaExiste = await MongoProtagonista.findOne({ nombre })

    if (protagonistaExiste) {
      return res.status(400).json({
        ok: false,
        msg: `Ya existe un protagonista llamado: ${nombre}`
      })
    }

    // Crear instancia de protagonista
    const protagonista = new MongoProtagonista({
      nombre,
      rol,
      descripcionRol,
      fecha
    })

    // Asociar con héroe si se proporciona ID
    if (heroeId) {
      const heroe = await MongoHeroe.findById(heroeId)
      if (!heroe) {
        return res.status(400).json({
          ok: false,
          msg: `No existe un héroe con el id: ${heroeId}`
        })
      }
      protagonista.heroes = [heroeId]
      // Actualizar también el héroe
      heroe.protagonistas = heroe.protagonistas || []
      if (!heroe.protagonistas.includes(protagonista._id)) {
        heroe.protagonistas.push(protagonista._id)
      }
      await heroe.save()
    }

    // Asociar con película si se proporciona ID
    if (peliculaId) {
      const pelicula = await MongoPelicula.findById(peliculaId)
      if (!pelicula) {
        return res.status(400).json({
          ok: false,
          msg: `No existe una película con el id: ${peliculaId}`
        })
      }
      protagonista.peliculas = [peliculaId]
      // Actualizar también la película
      pelicula.protagonistas = pelicula.protagonistas || []
      if (!pelicula.protagonistas.includes(protagonista._id)) {
        pelicula.protagonistas.push(protagonista._id)
      }
      await pelicula.save()
    }

    // Guardar en BD
    await protagonista.save()

    res.status(201).json({
      ok: true,
      mensaje: 'Protagonista creado',
      protagonista
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al crear protagonista',
      error
    })
  }
}

// Actualizar protagonista
const protagonistasPut = async (req = request, res = response) => {
  const { id } = req.params
  const { peliculaId, heroeId, ...resto } = req.body

  try {
    resto.fecha_actualizacion = now()

    const protagonista = await MongoProtagonista.findByIdAndUpdate(id, resto, { new: true })

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un protagonista con el id: ${id}`
      })
    }

    // Actualizar relación con héroe si se proporciona
    if (heroeId) {
      const heroe = await MongoHeroe.findById(heroeId)
      if (!heroe) {
        return res.status(400).json({
          ok: false,
          msg: `No existe un héroe con el id: ${heroeId}`
        })
      }

      // Actualizar protagonista
      const heroesActuales = protagonista.heroes || []
      if (!heroesActuales.includes(heroeId)) {
        heroesActuales.push(heroeId)
      }
      protagonista.heroes = heroesActuales
      await protagonista.save()

      // Actualizar también el héroe
      heroe.protagonistas = heroe.protagonistas || []
      if (!heroe.protagonistas.includes(id)) {
        heroe.protagonistas.push(id)
      }
      await heroe.save()
    }

    // Actualizar relación con película si se proporciona
    if (peliculaId) {
      const pelicula = await MongoPelicula.findById(peliculaId)
      if (!pelicula) {
        return res.status(400).json({
          ok: false,
          msg: `No existe una película con el id: ${peliculaId}`
        })
      }

      // Actualizar protagonista
      const peliculasActuales = protagonista.peliculas || []
      if (!peliculasActuales.includes(peliculaId)) {
        peliculasActuales.push(peliculaId)
      }
      protagonista.peliculas = peliculasActuales
      await protagonista.save()

      // Actualizar también la película
      pelicula.protagonistas = pelicula.protagonistas || []
      if (!pelicula.protagonistas.includes(id)) {
        pelicula.protagonistas.push(id)
      }
      await pelicula.save()
    }

    res.json({
      ok: true,
      msg: 'Protagonista actualizado',
      protagonista
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar protagonista',
      error
    })
  }
}

// Eliminar protagonista
const protagonistasDelete = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const protagonista = await MongoProtagonista.findByIdAndDelete(id)

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: `No existe un protagonista con el id: ${id}`
      })
    }

    // Eliminar referencias en héroes
    if (protagonista.heroes && protagonista.heroes.length > 0) {
      await MongoHeroe.updateMany(
        { _id: { $in: protagonista.heroes } },
        { $pull: { protagonistas: id } }
      )
    }

    // Eliminar referencias en películas
    if (protagonista.peliculas && protagonista.peliculas.length > 0) {
      await MongoPelicula.updateMany(
        { _id: { $in: protagonista.peliculas } },
        { $pull: { protagonistas: id } }
      )
    }

    res.json({
      ok: true,
      msg: 'Protagonista eliminado',
      protagonista
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar protagonista',
      error
    })
  }
}

module.exports = {
  protagonistasGet,
  protagonistaGet,
  protagonistasComoGet,
  protagonistasPost,
  protagonistasPut,
  protagonistasDelete
}
