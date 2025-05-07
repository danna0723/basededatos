const { response, request } = require('express')

const { Usuario } = require('../models')

const bcryptjs = require('bcryptjs')
const { now } = require('mongoose')

const { generarJWT } = require('../helpers/generar-jwt')

const usuariosGet = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit } = req.query;

  const { limite = 5, desde = 0 } = req.query
  const query = { estado: true }

  /*
  const usuarios = await Usuario.find(query)
     .skip(Number(desde))
     .limit(Number(limite));

  const total = await Usuario.countDocuments(query);
  */

  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query)
      .populate('rol', 'rol')
      .skip(Number(desde))
      .limit(Number(limite))
  ])

  res.json({
    total,
    usuarios
  })
}

const usuariosPost = async (req, res = response) => {
  const body = req.body

  const usuario = new Usuario(body)

  try {
    // Encryptar la constraseña
    const salt = bcryptjs.genSaltSync()
    usuario.password = bcryptjs.hashSync(usuario.password, salt)

    // Guardar en BD
    await usuario.save()

    // Generar el JWT
    const token = await generarJWT(usuario.id)

    res.json({
      ok: true,
      msg: 'Created ok',
      usuario,
      token
    })
  } catch (error) {
    res.json({ Ok: false, resp: error })
  }
}

const usuariosPut = async (req, res = response) => {
  const { id } = req.params
  const { _id, password, google, correo, ...resto } = req.body

  try {
    if (password) {
      // Encryptar la constraseña
      const salt = bcryptjs.genSaltSync()
      // let unpassword = usuario.password;
      resto.password = bcryptjs.hashSync(password, salt)
    }

    resto.fecha_actualizacion = now()
    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true })

    res.json({
      ok: true,
      msg: 'Update ok',
      usuario
    })
  } catch (error) {
    res.json({ Ok3: false, resp: error })
  }
}

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params

  try {
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false, fecha_actualizacion: now() }, { new: true })

    res.json({
      usuario
    })

    res.json({
      ok: true,
      msg: 'Delete ok',
      usuario
    })
  } catch (error) {
    res.json({ Ok: false, resp: error })
  }
}

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete
}
