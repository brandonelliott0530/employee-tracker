// const path = require('path');
const util = require("util");
const mysql = require("mysql2");
// require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
});
// db.connect(function (err) {
//   if (err) {
//     console.log(err);
//   }
// });

const query = util.promisify(db.query).bind(db);

module.exports = query;
