const mysql = require("mysql2");


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ducanh93',
    database: 'tick_tok',
    // Muốn dùng được multi query thì thêm:
    multipleStatements: true
})

const db = pool.promise();

module.exports = db;