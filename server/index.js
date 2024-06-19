// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'sql5.freesqldatabase.com',
  user: 'sql5714336',
  password: 'mCt3ensGVJ',
  database: 'sql5714336',
  port: 3306,
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to database:', error.message);
  } else {
    console.log('Connected to database successfully');
  }
});

// Routes
app.get('/todos-los-usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  connection.query(query, (err, rows) => {
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

  const query = 'INSERT INTO usuarios (nombres, apellidos, email, password, celular) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [nombres, apellidos, email, password, celular], (err, result) => {
    if (err) {
      console.error('Error al registrar usuario en MySQL:', err);
      return res.status(500).json({ error: 'Error al registrar usuario' });
    }
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son obligatorios' });
  }

  const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
  connection.query(query, [email, password], (err, rows) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app; // Para pruebas unitarias u otras configuraciones
