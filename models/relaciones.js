const { Heroes } = require('./mySqlHeroes')
const { Peliculas } = require('./mySqlPeliculas')
const { Protagonistas } = require('./mySqlProtagonistas')

function crearRelaciones () {
  // Peliculas tiene muchos Protagonistas
  Peliculas.hasMany(Protagonistas, { foreignKey: 'peliculaId' })
  Protagonistas.belongsTo(Peliculas, { foreignKey: 'peliculaId' })

  // Heroes tiene muchos Protagonistas
  Heroes.hasMany(Protagonistas, { foreignKey: 'heroeId' })
  Protagonistas.belongsTo(Heroes, { foreignKey: 'heroeId' })

  console.log('Relaciones inicializadas correctamente')
}

module.exports = {
  crearRelaciones
}
