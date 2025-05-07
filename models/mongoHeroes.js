const { Schema, model } = require('mongoose')

const HeroeSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio']
  },
  bio: {
    type: String,
    required: [true, 'La biografía es obligatoria']
  },
  img: {
    type: String,
    required: [true, 'La imagen es obligatoria']
  },
  aparicion: {
    type: Date
  },
  casa: {
    type: String
  },
  // Relación con protagonistas (referencia a IDs)
  protagonistas: [{
    type: Schema.Types.ObjectId,
    ref: 'MongoProtagonista'
  }],
  // Relación con películas (referencia a IDs)
  peliculas: [{
    type: Schema.Types.ObjectId,
    ref: 'MongoPelicula'
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
HeroeSchema.methods.toJSON = function () {
  const { __v, _id, ...heroe } = this.toObject()
  heroe.id = _id
  return heroe
}

module.exports = model('MongoHeroe', HeroeSchema)
