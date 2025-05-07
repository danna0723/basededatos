const express = require('express')
const cors = require('cors')

// const { bdmysql } = require('../database/MySqlConnection')
const { dbConnectionMongo } = require('../database/MongoConnection')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT

    // this.pathsMySql = {
    //   heroes: '/api/heroes',
    //   peliculas: '/api/peliculas',
    //   protagonistas: '/api/protagonistas'
    // }

    this.pathsMongo = {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      heroes: '/api/heroes',
      peliculas: '/api/peliculas',
      protagonistas: '/api/protagonistas',
      paises: '/api/paises',             
      equipos: '/api/equipos',           
      jugadores: '/api/jugadores',
      contrataciones: '/api/contrataciones'
    }
    /*
        this.app.get('/', function (req, res) {
            res.send('Hola Mundo a todos... como estan...')
        })
        */

    // // Aqui me conecto a la BD
    // this.dbConnection()

    // Conexion a mongo
    this.conectarMongo()

    // Middlewares
    this.middlewares()

    // Routes
    this.routes()
  }

  //   async dbConnection () {
  //     try {
  //       await bdmysql.authenticate()
  //       console.log('Connection OK a MySQL.')

  //       //   const { Heroes } = require('../models/mySqlHeroes')
  //       //   const { Peliculas } = require('../models/mySqlPeliculas')
  //       //   const { Protagonistas } = require('../models/mySqlProtagonistas')

  //       //   const { crearRelaciones } = require('../models/relaciones')
  //       //   crearRelaciones()

  //       //   await Heroes.sync({ alter: true })
  //       //   console.log('Tabla Heroes sincronizada.')

  //     //   await Peliculas.sync({ alter: true })
  //     //   console.log('Tabla Peliculas sincronizada.')
  //     //   await Protagonistas.sync({ alter: true })
  //     //   console.log('Tabla Protagonistas sincronizada.')
  //     } catch (error) {
  //       console.error('No se pudo Conectar a la BD MySQL', error)
  //     }
  //   }

  async conectarMongo () {
    await dbConnectionMongo()
  }

  routes () {
    // this.app.use(this.pathsMySql.auth, require('../routes/MySqlAuth'));
    // this.app.use(this.pathsMySql.heroes, require('../routes/mySqlHeroes.routes'))
    // this.app.use(this.pathsMySql.peliculas, require('../routes/mySqlPeliculas.routes'))
    // this.app.use(this.pathsMySql.protagonistas, require('../routes/mySqlProtagonistas.routes'))
    this.app.use(this.pathsMongo.usuarios, require('../routes/usuarios.routes'))
    this.app.use(this.pathsMongo.auth, require('../routes/auth.routes'))
    this.app.use(this.pathsMongo.heroes, require('../routes/mongoHeroes.routes'))
    this.app.use(this.pathsMongo.peliculas, require('../routes/mongoPeliculas.routes'))
    this.app.use(this.pathsMongo.protagonistas, require('../routes/mongoProtagonistas.routes'))
    this.app.use(this.pathsMongo.paises, require('../routes/mongoPaises.routes'))      
    this.app.use(this.pathsMongo.equipos, require('../routes/mongoEquipos.routes'))    
    this.app.use(this.pathsMongo.jugadores, require('../routes/mongoJugadores.routes'))
    this.app.use(this.pathsMongo.contrataciones, require('../routes/mongoContrataciones.routes'))

  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())

    // Directorio publico
    this.app.use(express.static('public'))
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('Servidor corriendo en puerto', this.port)
    })
  }
}

module.exports = Server
