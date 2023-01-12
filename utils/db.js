const session = require('express-session');
const mysql = require("mysql2");

const MySQLStore = require('express-mysql-session')(session);


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'ducanh93',
    database: 'tick_tok',
    // Muốn dùng được multi query thì thêm:
    multipleStatements: true
})

const db = pool.promise();

const options = {
    host: 'localhost',
    user: 'root',
    password: 'ducanh93',
    database: 'tick_tok',
    createDatabaseTable: false,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};
const sessionStore = new MySQLStore(options);

module.exports = { db: db, sessionStore: sessionStore };
