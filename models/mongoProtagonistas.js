const { Schema, model } = require('mongoose')

const ProtagonistaSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  rol: {
    type: String,
    required: [true, 'El rol es obligatorio']
  },
  descripcionRol: {
    type: String,
    required: [true, 'La descripción del rol es obligatoria']
  },
  fecha: {
    type: Date
  },
  // Relación con películas (referencia a IDs)
  peliculas: [{
    type: Schema.Types.ObjectId,
    ref: 'MongoPelicula'
  }],
  // Relación con héroes (referencia a IDs)
  heroes: [{
    type: Schema.Types.ObjectId,
    ref: 'MongoHeroe'
  }],
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  fecha_actualizacion: {
    type: Date
  }
})

// Método para personalizar la respuesta JSON
ProtagonistaSchema.methods.toJSON = function () {
  const { __v, _id, ...protagonista } = this.toObject()
  protagonista.id = _id
  return protagonista
}

module.exports = model('MongoProtagonista', ProtagonistaSchema)
