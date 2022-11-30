let mysql = require('mysql2')

// let pool = mysql.createPool({
// 	  connectionLimit : config.DB_MAXCONN,
// 	  host            : config.DB_HOST,
// 	  database		  : config.DB_DATABASE,
// 	  user            : config.DB_USER,
// 	  password        : config.DB_PASSWORD
// 	});

function connection() {
	return mysql.createConnection({
	  host            : process.env.MYSQL_HOST,
	  database		  	: process.env.MYSQL_DATABASE,
	  user            : process.env.MYSQL_USER,
	  password        : process.env.MYSQL_PASS
	})
}

function query(query, params = []) {
	return new Promise ((resolve, reject) => {
		con.query(query, params,
			function(err, rows, fields) {
				if(err) {
					console.error(err)
					reject(err)
				} else
					resolve(rows)
			})
	})
}

let con = connection()
con.connect()

setInterval(function () {
    con.query('SELECT 1')
}, 5000)


module.exports = {
	query : query
}

// con.end()