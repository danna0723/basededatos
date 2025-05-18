// const { Sequelize } = require('sequelize')

// const bdmysql = new Sequelize(
//   'railway',
//   process.env.RAILWAY_BD_USER,
//   process.env.RAILWAY_BD_PASSWORD,
//   {
//     host: process.env.RAILWAY_BD_HOST,
//     port: process.env.RAILWAY_BD_PORT,
//     dialect: 'mysql'
//   }
// )

// module.exports = {
//   bdmysql
// }


const { Sequelize } = require('sequelize');

const bdmysql = new Sequelize(
    'railway',
    'root',
    //ajustar el password de cada uno
    'iuXKzUhOqdttmJpGnLxiQSeScdaflZJR',
    {
        //ajustar el host de cada uno
        host: 'monorail.proxy.rlwy.net',
        //ajustar el puerto de cada uno
        port: '23251',
        dialect: 'mysql'
    }
);


module.exports = {
    bdmysql
}

// const { Sequelize } = require('sequelize');


// const bdmysql = new Sequelize(
//     'railway',
//     'root',
//     //ajustar el password de cada uno
//     'iuXKzUhOqdttmJpGnLxiQSeScdaflZJR',
//     ,
//     {
//         //ajustar el host de cada uno
//         host: 'monorail.proxy.rlwy.net',
//         //ajustar el puerto de cada uno
//         port: '23251',
//         dialect: 'mysql'
//     }
// );




// module.exports = {
//     bdmysql
// }

