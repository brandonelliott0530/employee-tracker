// const path = require('path');
const util = require("util");
const mysql = require("mysql2");

// connects to the .env file using the dotenv package that is brought into the application in the index.js file.
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
});

const query = util.promisify(db.query).bind(db);

module.exports = query;
