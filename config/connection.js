const util = require('util');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

const query = util.promisify(db.query).bind()


module.exports = query