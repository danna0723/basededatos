const mongoose = require('mongoose'); 
const { Schema, model } = mongoose;

// Esquema del Jugador
const jugadorSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  fecha_nacimiento: {
    type: Date,
    required: true,
  },
  pais_nacimiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MongoPais',
    required: true, 
  },
  equipo_actual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MongoEquipo',
    required: true, 
  },
  contrataciones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MongoContratacion', 
  }],
}, {
  timestamps: true,  
});

jugadorSchema.methods.toJSON = function () {
  const { __v, _id, ...jugador } = this.toObject(); 
  jugador.id = _id;  
  return jugador;
};

// Crear el modelo MongoJugador
//const MongoJugador = model('MongoJugador', jugadorSchema);

module.exports = model('MongoJugador', jugadorSchema);


