const mysql = require('mysql2');

const pool = mysql.createPool({
  host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'santral_lfdb', 
  waitForConnections: true
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database!');
    connection.release();
  }
});

module.exports = pool;