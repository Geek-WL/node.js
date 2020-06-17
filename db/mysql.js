const mysql = require('mysql')
const {MYSQL_CONFIG} = require('../config/db')
const connection = mysql.createConnection(MYSQL_CONFIG)
connection.connect()

const exc = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (error, results) {
            if(error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = {
    exc,
    escape: mysql.escape
}