// configBD.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((error) => {
  if (!error) {
    console.log('Conexión exitosa a la base de datos');
  } else {
    console.error('Error en la conexión a la base de datos:', error.message);
    console.error('Detalle del error:', error);
  }
});

module.exports = connection;
