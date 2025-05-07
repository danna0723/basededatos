const { response } = require("express");
const { MongoPais } = require("../models");
const { now } = require("mongoose");

const obtenerPaises = async (req, res = response) => {
  const { limite = 10, desde = 0 } = req.query;
  const query = {};

  try {
    const [total, paises] = await Promise.all([
      MongoPais.countDocuments(query),
      MongoPais.find(query)
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total, resp: paises });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerPais = async (req, res = response) => {
  const { id } = req.params;

  try {
    const pais = await MongoPais.findById(id);

    if (!pais) {
      return res.status(404).json({ Ok: false, msg: `No existe un país con id: ${id}` });
    }

    res.json({ Ok: true, resp: pais });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const crearPais = async (req, res = response) => {
  const { nombre } = req.body;

  try {
    // Verificar si ya existe un país con el mismo nombre
    const existePais = await MongoPais.findOne({ nombre });

    if (existePais) {
      return res.status(400).json({ Ok: false, msg: `Ya existe un país con el nombre: ${nombre}` });
    }

    // Crear el nuevo país
    const pais = new MongoPais(req.body);
    await pais.save();

    res.status(201).json({ Ok: true, msg: "País creado", resp: pais });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const actualizarPais = async (req, res = response) => {
  const { id } = req.params;
  const datos = { ...req.body, fecha_actualizacion: now() };

  try {
    const pais = await MongoPais.findByIdAndUpdate(id, datos, { new: true });

    if (!pais) {
      return res.status(404).json({ Ok: false, msg: `No existe un país con id: ${id}` });
    }

    res.json({ Ok: true, msg: "País actualizado", resp: pais });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const borrarPais = async (req, res = response) => {
  const { id } = req.params;

  try {
    const paisBorrado = await MongoPais.findByIdAndDelete(id);

    if (!paisBorrado) {
      return res.status(404).json({ Ok: false, msg: `No existe un país con id: ${id}` });
    }

    res.json({ Ok: true, msg: "País eliminado", resp: paisBorrado });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  obtenerPaises,
  obtenerPais,
  crearPais,
  actualizarPais,
  borrarPais
};
