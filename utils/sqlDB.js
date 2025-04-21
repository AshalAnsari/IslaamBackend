const mysql = require("mysql2")
const dotenv = require("dotenv");

dotenv.config()

const db = mysql.createConnection({
    host:process.env.SQLHOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DATABASE
})

module.exports = db