const { response, request } = require('express')
const { Protagonistas } = require('../models/mySqlProtagonistas')
const { Peliculas } = require('../models/mySqlPeliculas')
const { Heroes } = require('../models/mySqlHeroes')
const { Op } = require('sequelize')

const protagonistasGet = async (req, res = response) => {
  try {
    const protagonistas = await Protagonistas.findAll()

    res.json({
      ok: true,
      data: protagonistas
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

const protagonistaIdGet = async (req, res = response) => {
  const { id } = req.params

  try {
    const protagonista = await Protagonistas.findByPk(id)

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un protagonista con el id: ' + id
      })
    }

    res.json({
      ok: true,
      data: protagonista
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

const protagonistasComoGet = async (req = request, res = response) => {
  const { termino } = req.params

  try {
    const protagonistas = await Protagonistas.findAll({
      attributes: ['nombre', 'rol'], // Cambiado de 'foto_url' a 'rol'
      where: {
        nombre: {
          [Op.like]: `%${termino}%`
        }
      },
      order: [['nombre', 'ASC']]
    })

    if (protagonistas.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un protagonista con el nombre: ' + termino
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
      msg: 'Hable con el Administrador',
      err: error
    })
  }
}

const protagonistasPost = async (req = request, res = response) => {
  try {
    console.log(req.body)

    const { nombre, rol, descripcionRol, fecha, peliculaId, heroeId } = req.body

    const protagonista = new Protagonistas({
      nombre,
      rol,
      descripcionRol,
      fecha,
      peliculaId,
      heroeId
    })

    const existeProtagonista = await Protagonistas.findOne({ where: { nombre } })

    if (existeProtagonista) {
      return res.status(400).json({
        ok: false,
        msg: 'Ya existe un Protagonista llamado: ' + nombre
      })
    }

    // Verificar si existe el héroe (solo si se proporcionó heroeId)
    if (heroeId) {
      const existeHeroe = await Heroes.findByPk(heroeId)
      if (!existeHeroe) {
        return res.status(400).json({
          ok: false,
          msg: 'No existe un Heroe con el id: ' + heroeId
        })
      }
    }

    // Verificar si existe la película (solo si se proporcionó peliculaId)
    if (peliculaId) {
      const existePelicula = await Peliculas.findByPk(peliculaId)
      if (!existePelicula) {
        return res.status(400).json({
          ok: false,
          msg: 'No existe una Pelicula con el id: ' + peliculaId
        })
      }
    }

    // Guardar en BD
    await protagonista.save()

    res.json({
      ok: true,
      mensaje: 'Protagonista Creado',
      data: protagonista
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

const protagonistaPut = async (req = request, res = response) => {
  const { id } = req.params
  const { body } = req

  try {
    const protagonista = await Protagonistas.findByPk(id)

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un protagonista con el id: ' + id
      })
    }

    await protagonista.update(body)

    res.json({
      ok: true,
      msg: 'Protagonista actualizado',
      data: protagonista
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

const protagonistaDelete = async (req = request, res = response) => {
  const { id } = req.params

  try {
    const protagonista = await Protagonistas.findByPk(id)

    if (!protagonista) {
      return res.status(404).json({
        ok: false,
        msg: 'No existe un protagonista con el id: ' + id
      })
    }

    // Borrado de la BD
    await protagonista.destroy()

    res.json({
      ok: true,
      msj: 'Protagonista Borrado..',
      data: protagonista
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
  protagonistasGet,
  protagonistaIdGet,
  protagonistasComoGet,
  protagonistasPost,
  protagonistaPut,
  protagonistaDelete
}
