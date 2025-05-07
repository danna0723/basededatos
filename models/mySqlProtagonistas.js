const { DataTypes } = require('sequelize')
const { bdmysql } = require('../database/MySqlConnection')

const Protagonistas = bdmysql.define('protagonistas', {
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
  rol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcionRol: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fecha: {
    type: DataTypes.DATE,
    allowNull: true
  },
  peliculaId: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  heroeId: {
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  freezeTableName: true,
  createdAt: false,
  updatedAt: false
})

module.exports = {
  Protagonistas
}
