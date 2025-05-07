const { response, request } = require("express");
const { MongoJugador, MongoEquipo, MongoPais, MongoContratacion } = require("../models");
const { isValidObjectId } = require("../helpers/mongo-verify");
const mongoose = require('mongoose');

// Obtener todas las contrataciones de un jugador
const obtenerContratacionesJugador = async (req = request, res = response) => {
    const { id } = req.params;  // Extraemos el id del jugador desde los parámetros de la ruta
    const { limite = 5, desde = 0 } = req.query;
  
    try {
      // Verifica si los parámetros de paginación son números válidos
      const limiteNum = Number(limite);
      const desdeNum = Number(desde);
  
      // Asegurarse de que limiteNum y desdeNum sean números positivos
      if (isNaN(limiteNum) || isNaN(desdeNum) || limiteNum < 1 || desdeNum < 0) {
        return res.status(400).json({ Ok: false, msg: "Parámetros de paginación inválidos" });
      }
  
      // Buscamos las contrataciones de un jugador específico con paginación
      const [total, contrataciones] = await Promise.all([
        MongoContratacion.countDocuments({ jugador: id }),  // Total de contrataciones
        MongoContratacion.find({ jugador: id })  // Encontrar contrataciones
          .populate("equipo", "nombre fundado")  // Populamos el equipo con nombre y fundación
          .populate("jugador", "nombre fecha_nacimiento")  // Populamos el jugador con nombre y fecha de nacimiento
          .skip(desdeNum)  // Aplicar el offset
          .limit(limiteNum),  // Aplicar el límite
      ]);
  
      // Retornar la respuesta con el total de contrataciones y las contrataciones encontradas
      res.json({ Ok: true, total: total, contrataciones: contrataciones });
    } catch (error) {
      // Si hay un error, responder con el error
      console.error(error);
      res.status(500).json({ Ok: false, msg: "Error al obtener las contrataciones", error: error.message });
    }
  };
  

// Crear una nueva contratación
// Crear una nueva contratación
const crearContratacion = async (req, res) => {
    const { jugador, equipo, fecha_contratacion, monto } = req.body;
  
    try {
      // Verifica si los IDs del jugador y el equipo son válidos
      const jugadorExistente = await MongoJugador.findById(jugador);
      const equipoExistente = await MongoEquipo.findById(equipo);
  
      if (!jugadorExistente) {
        return res.status(400).json({ Ok: false, msg: 'El jugador no existe' });
      }
  
      if (!equipoExistente) {
        return res.status(400).json({ Ok: false, msg: 'El equipo no existe' });
      }
  
      // Crea la nueva contratación
      const contratacion = new MongoContratacion({
        jugador,
        equipo,
        fecha_contratacion,
        monto,
      });
  
      // Guarda la contratación
      await contratacion.save();
  
      res.status(201).json({ Ok: true, msg: 'Contratación creada con éxito', contratacion });
    } catch (error) {
      res.status(500).json({ Ok: false, msg: 'Error al crear la contratación', error: error.message });
    }
  };
      
    
// Actualizar una contratación existente
const actualizarContratacion = async (req = request, res = response) => {
  const { id } = req.params;  // Extraemos el id de la contratación desde los parámetros de la ruta
  const { monto, fecha_contratacion } = req.body;

  try {
    const contratacionExistente = await MongoContratacion.findById(id);
    if (!contratacionExistente) {
      return res.status(404).json({ Ok: false, msg: `No existe la contratación con id: ${id}` });
    }

    // Actualizamos los campos proporcionados
    contratacionExistente.monto = monto || contratacionExistente.monto;
    contratacionExistente.fecha_contratacion = fecha_contratacion || contratacionExistente.fecha_contratacion;

    await contratacionExistente.save();

    res.json({ Ok: true, msg: 'Contratación actualizada', contratacion: contratacionExistente });
  } catch (error) {
    res.status(500).json({ Ok: false, msg: 'Error al actualizar la contratación', error: error.message });
  }
};

// Eliminar una contratación (Marcar como inactiva)
const eliminarContratacion = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const contratacionEliminada = await MongoContratacion.findByIdAndUpdate(
      id,
      { estado: false, fecha_actualizacion: new Date() },
      { new: true }
    );

    if (!contratacionEliminada) {
      return res.status(404).json({ Ok: false, msg: `No existe la contratación con id: ${id}` });
    }

    res.json({ Ok: true, msg: "Contratación eliminada", contratacion: contratacionEliminada });
  } catch (error) {
    res.status(500).json({ Ok: false, msg: 'Error al eliminar la contratación', error: error.message });
  }
};
const obtenerContrataciones = async (req, res) => {
    try {
      const contrataciones = await MongoContratacion.find()
        .populate('jugador', 'nombre fecha_nacimiento')  // Poblar el jugador con nombre y fecha de nacimiento
        .populate('equipo', 'nombre fundado');  // Poblar el equipo con nombre y fecha de fundación
  
      res.json({ Ok: true, contrataciones });
    } catch (error) {
      res.status(500).json({ Ok: false, msg: 'Error al obtener las contrataciones', error: error.message });
    }
  };
  
module.exports = {
  obtenerContratacionesJugador,
  crearContratacion,
  actualizarContratacion,
  eliminarContratacion,
  obtenerContrataciones ,
};
