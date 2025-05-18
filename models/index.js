const Usuario = require('./mongoUsuario.js')
const Server = require('./server')
const Heroe = require('./mySqlHeroes')
const MongoHeroe = require('./mongoHeroes.js')
const MongoPelicula = require('./mongoPeliculas.js')
const MongoProtagonista = require('./mongoProtagonistas.js')
const MongoPais = require('./mongoPais.js')
const MongoEquipo = require('./mongoEquipo.js')
const MongoJugador = require('./mongoJugador.js')
const MongoContratacion = require('../models/mongoContrataciones');
const Neo4jPaises = require('./neo4jPaises.js')

module.exports = {
  Usuario,
  Server,
  Heroe,
  MongoHeroe,
  MongoPelicula,
  MongoProtagonista,
  MongoPais,
  MongoEquipo,
  MongoJugador,
  MongoContratacion,
  Neo4jPaises
}
