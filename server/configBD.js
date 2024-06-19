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
    console.log('Conexión exitosa a la base de datos');
  } else {
    console.error('Error en la conexión a la base de datos:', error.message);
  }
});

module.exports = connection;
