const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5714336',
  password: 'mCt3ensGVJ',
  database: 'sql5714336',
  port: 3306,
});

connection.connect((error) => {
  if (!error) {
    console.log('Conexión exitosa');
  } else {
    console.error('Conexión fallida:', error.message);
  }
});

module.exports = connection;
