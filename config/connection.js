const Sequelize = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.USER,
    process.env.PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
        port: 3001,
    }
)

module.exports = sequelize