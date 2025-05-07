const { Schema, model } = require('mongoose');

const EquipoSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del equipo es obligatorio'],
  },
  pais: {
    type: Schema.Types.ObjectId,
    ref: 'MongoPais',
    required: [true, 'El país es obligatorio'],
  },
  fundado: {
    type: Date,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    required: 'Debe tener una fecha de Creación.',
  },
  fecha_actualizacion: { 
    type: Date 
  },
});

EquipoSchema.methods.toJSON = function () {
  const { __v, _id, ...equipo } = this.toObject();
  equipo.id = _id;
  return equipo;
};

module.exports = model('MongoEquipo', EquipoSchema);

