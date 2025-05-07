const { Schema, model } = require('mongoose');

const PaisSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del país es obligatorio'],
  },
  codigo: {
    type: String,
    required: [true, 'El código del país es obligatorio'],
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  fecha_creacion: {
    type: Date,
    default: Date.now,
    required: 'Debe tener una fecha de Creación.',
  },
  fecha_actualizacion: { 
    type: Date 
  }
});

PaisSchema.methods.toJSON = function () {
  const { __v, _id, ...pais } = this.toObject();
  pais.id = _id;
  return pais;
};

module.exports = model('MongoPais', PaisSchema);

