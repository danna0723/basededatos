const { DataTypes } = require('sequelize')
const { bdmysql } = require('../database/MySqlConnection')

const Peliculas = bdmysql.define('peliculas', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sinopsis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clasificacion: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: null
  },
  puntuacion: {
    type: DataTypes.FLOAT(),
    allowNull: true,
    defaultValue: null
  }

},
{
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
})

module.exports = {
  Peliculas
}
