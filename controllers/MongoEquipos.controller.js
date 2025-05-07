const { response, request } = require('express');
const { MongoEquipo, MongoPais } = require('../models'); 
const { now } = require('mongoose');
const mongoose = require('mongoose');

const equiposGet = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;

  try {
    const [total, equipos] = await Promise.all([
      MongoEquipo.countDocuments(),
      MongoEquipo.find()
        .populate('pais', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({ total, equipos });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener equipos', error });
  }
};

const equipoGet = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const equipo = await MongoEquipo.findById(id).populate('pais', 'nombre');

    if (!equipo) {
      return res.status(404).json({ ok: false, msg: `No existe un equipo con id: ${id}` });
    }

    res.json({ ok: true, equipo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al obtener equipo', error });
  }
};

const equiposPost = async (req = request, res = response) => {
  try {
    // Validar que el ID del país sea un ObjectId válido
    if (req.body.pais && !mongoose.Types.ObjectId.isValid(req.body.pais)) {
      return res.status(400).json({ ok: false, msg: 'El ID del país no es válido' });
    }

    // Si el país existe, buscarlo en la base de datos
    if (req.body.pais) {
      const paisExistente = await MongoPais.findById(req.body.pais);
      if (!paisExistente) {
        return res.status(400).json({ ok: false, msg: 'El país proporcionado no existe' });
      }
    }

    // Crear el nuevo equipo
    const equipo = new MongoEquipo(req.body);
    await equipo.save();

    // Populamos el campo 'pais' para obtener el nombre del país en lugar del ID
    const equipoConPais = await MongoEquipo.findById(equipo.id).populate('pais', 'nombre');

    res.status(201).json({ ok: true, msg: 'Equipo creado', equipo: equipoConPais });
  } catch (error) {
    console.error(error);  // Loguea el error completo
    res.status(500).json({ ok: false, msg: 'Error al crear equipo', error: error.message });
  }
};


const equiposPut = async (req = request, res = response) => {
  const { id } = req.params;
  const datos = { ...req.body, fecha_actualizacion: now() };

  try {
    if (datos.pais) {
      const paisExistente = await MongoPais.findById(datos.pais);  // Se cambió 'Pais' por 'MongoPais'
      if (!paisExistente) {
        return res.status(400).json({ ok: false, msg: 'El país proporcionado no existe' });
      }
    }

    const equipo = await MongoEquipo.findByIdAndUpdate(id, datos, { new: true });

    if (!equipo) {
      return res.status(404).json({ ok: false, msg: `No existe un equipo con id: ${id}` });
    }

    res.json({ ok: true, msg: 'Equipo actualizado', equipo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al actualizar equipo', error });
  }
};

const equiposDelete = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const equipo = await MongoEquipo.findByIdAndDelete(id);

    if (!equipo) {
      return res.status(404).json({ ok: false, msg: `No existe un equipo con id: ${id}` });
    }

    res.json({ ok: true, msg: 'Equipo eliminado', equipo });
  } catch (error) {
    res.status(500).json({ ok: false, msg: 'Error al eliminar equipo', error });
  }
};

module.exports = {
  equiposGet,
  equipoGet,
  equiposPost,
  equiposPut,
  equiposDelete
};
