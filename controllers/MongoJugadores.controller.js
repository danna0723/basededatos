const { response, request } = require("express");
const { MongoJugador, MongoEquipo, MongoPais } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const { now } = require("mongoose");
const mongoose = require('mongoose');
const MongoContratacion = require("../models/mongoContrataciones");  // Importamos el modelo de contrataciones

const obtenerJugadores = async (req = request, res = response) => {
  const { limite = 10, desde = 0 } = req.query;

  try {
    const [total, jugadores] = await Promise.all([
      MongoJugador.countDocuments(),
      MongoJugador.find()
        .populate('pais_nacimiento', 'nombre') 
        .populate('equipo_actual', 'nombre fundado')
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: jugadores });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerJugador = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    // Buscamos al jugador y poblamos los datos relacionados, incluyendo las contrataciones
    const jugador = await MongoJugador.findById(id)
      .populate('pais_nacimiento', 'nombre')
      .populate('equipo_actual', 'nombre fundado')
      // .populate({
      //   path: 'contrataciones',
      //   populate: {
      //     path: 'equipo',  // Poblamos los datos del equipo asociado a la contratación
      //     select: 'nombre fundado',
      //   }
      // })
      .lean();  // Usamos .lean() para obtener un objeto plano y optimizar la consulta

    if (!jugador) {
      return res.status(404).json({ Ok: false, resp: `No existe un jugador con id: ${id}` });
    }

    // Formatear las fechas de nacimiento y fundación
    const formatearFecha = (fecha) => {
      return new Date(fecha).toISOString().split('T')[0];
    };

    if (jugador.fecha_nacimiento) {
      jugador.fecha_nacimiento = formatearFecha(jugador.fecha_nacimiento);
    }

    if (jugador.equipo_actual?.fundado) {
      jugador.equipo_actual.fundado = formatearFecha(jugador.equipo_actual.fundado);
    }

    // Procesamos las contrataciones
    const jugadorConDatos = {
      nombre: jugador.nombre,
      fecha_nacimiento: jugador.fecha_nacimiento,
      pais: jugador.pais_nacimiento ? jugador.pais_nacimiento.nombre : 'No asignado',
      equipo_actual: jugador.equipo_actual ? jugador.equipo_actual.nombre : 'No asignado',
      fundado: jugador.equipo_actual ? jugador.equipo_actual.fundado : null,
        // contrataciones: jugador.contrataciones.map(con => ({
        //   equipo: con.equipo ? con.equipo.nombre : 'No asignado',
        //   fundado: con.equipo ? con.equipo.fundado : null,
        //   monto: con.monto,
        //   fecha_contratacion: con.fecha_contratacion,
        // })),
      id: jugador.id,
    };

    res.json({ Ok: true, resp: jugadorConDatos });
  } catch (error) {
    res.status(500).json({ Ok: false, resp: error.message });
  }
};

const obtenerContratacionesJugador = async (req, res) => {
  const { id } = req.params;  // Extraemos el id del jugador desde los parámetros de la ruta
  const { limite = 5, desde = 0 } = req.query;

  try {
    const limiteNum = Number(limite);
    const desdeNum = Number(desde);

    // Validación de parámetros de paginación
    if (isNaN(limiteNum) || isNaN(desdeNum) || limiteNum < 1 || desdeNum < 0) {
      return res.status(400).json({ Ok: false, msg: "Parámetros de paginación inválidos" });
    }

    // Obtener el total y las contrataciones del jugador con la paginación aplicada
    const [total, contrataciones] = await Promise.all([
      MongoContratacion.countDocuments({ jugador: id }),
      MongoContratacion.find({ jugador: id })
        .populate("equipo", "nombre fundado")  // Populate equipo con nombre y fundación
        .populate("jugador", "nombre fecha_nacimiento")  // Populate jugador con nombre y fecha de nacimiento
        .skip(desdeNum)
        .limit(limiteNum),
    ]);

    res.json({ Ok: true, total: total, contrataciones: contrataciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ Ok: false, msg: "Error al obtener las contrataciones", error: error.message });
  }
};


const obtenerJugadoresPais = async (req = request, res = response) => {
  const { id } = req.params;
  const { limite = 5, desde = 0 } = req.query;
  const query = { "pais_nacimiento": id };

  try {
    const [total, jugadores] = await Promise.all([
      MongoJugador.countDocuments(query),
      MongoJugador.find(query)
        .populate("equipo_actual", "nombre fundado")
        .populate("pais_nacimiento", "nombre")
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({ Ok: true, total: total, resp: jugadores });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const jugadoresPost = async (req, res) => {
  try {
    // Validación de los IDs de país y equipo
    if (req.body.pais_nacimiento && !mongoose.Types.ObjectId.isValid(req.body.pais_nacimiento)) {
      return res.status(400).json({ ok: false, msg: 'El ID del país de nacimiento no es válido' });
    }

    if (req.body.pais_nacimiento) {
      const paisExistente = await MongoPais.findById(req.body.pais_nacimiento);
      if (!paisExistente) {
        return res.status(400).json({ ok: false, msg: 'El país de nacimiento proporcionado no existe' });
      }
    }

    if (req.body.equipo_actual && !mongoose.Types.ObjectId.isValid(req.body.equipo_actual)) {
      return res.status(400).json({ ok: false, msg: 'El ID del equipo actual no es válido' });
    }

    if (req.body.equipo_actual) {
      const equipoExistente = await MongoEquipo.findById(req.body.equipo_actual);
      if (!equipoExistente) {
        return res.status(400).json({ ok: false, msg: 'El equipo actual proporcionado no existe' });
      }
    }

    // Creación del jugador
    const jugador = new MongoJugador(req.body);
    await jugador.save();

    // Obtener el jugador con los datos poblados
    const jugadorConPaisYEquipo = await MongoJugador.findById(jugador.id)
      .populate('pais_nacimiento', 'nombre')
      .populate('equipo_actual', 'nombre fundado')
      .lean();  // Usamos .lean() para obtener objetos planos

    // Formatear las fechas a formato ISO sin la parte de la hora
    const formatearFecha = (fecha) => {
      return new Date(fecha).toISOString().split('T')[0];
    };

    // Formateamos las fechas de nacimiento y fundación
    if (jugadorConPaisYEquipo.fecha_nacimiento) {
      jugadorConPaisYEquipo.fecha_nacimiento = formatearFecha(jugadorConPaisYEquipo.fecha_nacimiento);
    }

    if (jugadorConPaisYEquipo.equipo_actual?.fundado) {
      jugadorConPaisYEquipo.equipo_actual.fundado = formatearFecha(jugadorConPaisYEquipo.equipo_actual.fundado);
    }

    // Responder con el jugador creado
    res.status(201).json({ ok: true, msg: 'Jugador creado', jugador: jugadorConPaisYEquipo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear jugador', error: error.message });
  }
};

const actualizarJugador = async (req = request, res = response) => {
  const { id } = req.params;
  const { equipo, pais, ...data } = req.body;

  try {
    if (equipo && !isValidObjectId(equipo)) {
      return res.status(400).json({ Ok: false, resp: `El ID del equipo ${equipo} no es válido` });
    }

    if (pais && !isValidObjectId(pais)) {
      return res.status(400).json({ Ok: false, resp: `El ID del país ${pais} no es válido` });
    }

    const jugador = await MongoJugador.findById(id);
    if (jugador.equipo !== equipo) {
      data.equiposPrevios = jugador.equipo ? [...jugador.equiposPrevios, jugador.equipo] : jugador.equiposPrevios;
    }

    data.fecha_actualizacion = now();

    const jugadorActualizado = await MongoJugador.findByIdAndUpdate(id, data, { new: true });

    if (!jugadorActualizado) {
      return res.status(404).json({ Ok: false, resp: `No existe un jugador con id: ${id}` });
    }

    res.json({ Ok: true, resp: jugadorActualizado });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const borrarJugador = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const jugadorBorrado = await MongoJugador.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: now() },
      { new: true }
    );

    if (!jugadorBorrado) {
      return res.status(404).json({ Ok: false, resp: `No existe un jugador con id: ${id}` });
    }

    res.json({ Ok: true, resp: jugadorBorrado });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

const obtenerJugadoresEquipo = async (req = request, res = response) => {
  const { id } = req.params;
  const { limite = 5, desde = 0 } = req.query;
  const query = { equipo: id };

  try {
    const [total, jugadores] = await Promise.all([
      MongoJugador.countDocuments(query),
      MongoJugador.find(query)
        .populate("equipo", "nombre")
        .populate("pais", "nombre")
        .skip(Number(desde))
        .limit(Number(limite)),
    ]);

    res.json({ Ok: true, total: total, resp: jugadores });
  } catch (error) {
    res.json({ Ok: false, resp: error });
  }
};

module.exports = {
  obtenerJugadores,
  obtenerJugador,
  obtenerJugadoresEquipo,
  obtenerJugadoresPais,
  jugadoresPost,
  actualizarJugador,
  borrarJugador,
  obtenerContratacionesJugador,
};
