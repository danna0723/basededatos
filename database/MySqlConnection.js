const { Sequelize } = require('sequelize')

const bdmysql = new Sequelize(
  'railway',
  process.env.RAILWAY_BD_USER,
  process.env.RAILWAY_BD_PASSWORD,
  {
    host: process.env.RAILWAY_BD_HOST,
    port: process.env.RAILWAY_BD_PORT,
    dialect: 'mysql'
  }
)

module.exports = {
  bdmysql
}
