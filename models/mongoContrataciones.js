const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contratacionSchema = new Schema({
  jugador: { type: mongoose.Schema.Types.ObjectId, ref: 'MongoJugador', required: true },  // Referencia al jugador
  equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'MongoEquipo', required: true },  // Referencia al equipo
  fecha_contratacion: { type: Date, required: true },
  monto: { type: Number, required: true },
});

const MongoContratacion = mongoose.model('MongoContratacion', contratacionSchema);

module.exports = MongoContratacion;



