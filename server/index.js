const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysqlConnection = require('./configBD');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/todos-los-usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios'; 
  mysqlConnection.query(query, (err, rows) => {
    if (err) {
      console.error('Error al obtener usuarios desde MySQL:', err);
      return res.status(500).json({ error: 'Error al obtener usuarios' });
    }
    res.json(rows); 
  });
});


app.post('/registro', (req, res) => {
  const { nombres, apellidos, email, password, celular } = req.body;
  if (!nombres || !apellidos || !email || !password || !celular) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Implementa la lógica para insertar el nuevo usuario en la base de datos
  const query = 'INSERT INTO usuarios (nombres, apellidos, email, password, celular) VALUES (?, ?, ?, ?, ?)';
  mysqlConnection.query(query, [nombres, apellidos, email, password, celular], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario en MySQL:', err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  });
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la página principal!');
});


app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios' });
  }

  // Consulta para buscar al usuario por email y contraseña
  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  mysqlConnection.query(query, [email, password], (err, rows) => {
    if (err) {
      console.error('Error al buscar usuario en MySQL:', err);
      return res.status(500).json({ error: 'Error al buscar usuario' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o contraseña incorrecta' });
    }

    const user = rows[0];
    res.json({ message: 'Inicio de sesión exitoso', user });
  });
});

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


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
