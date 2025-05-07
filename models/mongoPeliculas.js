const { Schema, model } = require('mongoose')

const PeliculaSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  sinopsis: {
    type: String,
    required: [true, 'La sinopsis es obligatoria']
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio']
  },
  clasificacion: {
    type: String
  },
  puntuacion: {
    type: Number
  },
  // Relación con protagonistas (referencia a IDs)
  protagonistas: [{
    type: Schema.Types.ObjectId,
    ref: 'MongoProtagonista'
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
PeliculaSchema.methods.toJSON = function () {
  const { __v, _id, ...pelicula } = this.toObject()
  pelicula.id = _id
  return pelicula
}

module.exports = model('MongoPelicula', PeliculaSchema)
