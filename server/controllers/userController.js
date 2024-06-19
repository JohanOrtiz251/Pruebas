/* const fs = require('fs').promises;
const path = require('path');


const usuariosRegistradosPath = path.join(__dirname, '..', '..', 'src', 'componentes', 'usuariosRegistrados.json');
const lastUserIdPath = path.join(__dirname, '..', '..', 'src', 'componentes', 'lastUserId.json');



async function getLastUserId() {
  try {
    const data = await fs.readFile(lastUserIdPath, 'utf-8');
    const { lastUserId } = JSON.parse(data);
    return lastUserId;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(lastUserIdPath, JSON.stringify({ lastUserId: 0 }));
      return 0;
    } else {
      throw error;
    }
  }
}


async function incrementLastUserId() {
  const lastUserId = await getLastUserId();
  const newLastUserId = lastUserId + 1;
  await fs.writeFile(lastUserIdPath, JSON.stringify({ lastUserId: newLastUserId }));
  return newLastUserId;
}



async function registrarUsuario(req, res) {
  try {
    const { nombres, apellidos, email, password, celular } = req.body;
    if (!nombres || !apellidos || !email || !password || !celular) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newUserId = await incrementLastUserId();

    let usuariosRegistrados = [];
    try {
      const data = await fs.readFile(usuariosRegistradosPath, 'utf-8');
      usuariosRegistrados = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    if (usuariosRegistrados.find(user => user.email === email)) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const nuevoUsuario = {
      id: newUserId,
      nombres,
      apellidos,
      email,
      password,
      celular
    };
    usuariosRegistrados.push(nuevoUsuario);
    await fs.writeFile(usuariosRegistradosPath, JSON.stringify(usuariosRegistrados, null, 2));

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: newUserId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}


async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body;

    const data = await fs.readFile(usuariosRegistradosPath, 'utf-8');
    const usuariosRegistrados = JSON.parse(data);
    
    const usuario = usuariosRegistrados.find(user => user.email === email);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}


module.exports = {
  registrarUsuario,
  iniciarSesion
};
 */


// Esta parte es para registrar e iniciar sesion usando el .json de manera remota

const axios = require('axios');

const usuariosRegistradosUrl = 'https://api.jsonbin.io/v3/b/664e4495e41b4d34e4f7d7f2';
const lastUserIdUrl = 'https://api.jsonbin.io/v3/b/664e449cacd3cb34a84c031d';
const masterKey = '$2a$10$/mcvIEltjOIKAA3.1TkrE.D1nJgzbo5AigxCM0BKZOSh5HXm2.9o2';

async function getLastUserId() {
  try {
    const response = await axios.get(lastUserIdUrl, {
      headers: {
        'X-Master-Key': masterKey,
      },
    });
    const { record } = response.data;
    return record.lastUserId || 0;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      await axios.put(lastUserIdUrl, { lastUserId: 0 }, {
        headers: {
          'X-Master-Key': masterKey,
          'Content-Type': 'application/json',
        },
      });
      return 0;
    } else {
      throw error;
    }
  }
}

async function incrementLastUserId() {
  const lastUserId = await getLastUserId();
  const newLastUserId = lastUserId + 1;
  await axios.put(lastUserIdUrl, { lastUserId: newLastUserId }, {
    headers: {
      'X-Master-Key': masterKey,
      'Content-Type': 'application/json',
    },
  });
  return newLastUserId;
}

async function registrarUsuario(req, res) {
  try {
    const { nombres, apellidos, email, password, celular } = req.body;
    if (!nombres || !apellidos || !email || !password || !celular) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const newUserId = await incrementLastUserId();

    let usuariosRegistrados = [];
    try {
      const response = await axios.get(usuariosRegistradosUrl, {
        headers: {
          'X-Master-Key': masterKey,
        },
      });
      usuariosRegistrados = response.data.record;
    } catch (error) {
      if (error.response && error.response.status !== 404) {
        throw error;
      }
    }

    if (usuariosRegistrados.find(user => user.email === email)) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    const nuevoUsuario = {
      id: newUserId,
      nombres,
      apellidos,
      email,
      password,
      celular,
    };
    usuariosRegistrados.push(nuevoUsuario);
    await axios.put(usuariosRegistradosUrl, usuariosRegistrados, {
      headers: {
        'X-Master-Key': masterKey,
        'Content-Type': 'application/json',
      },
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: newUserId });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}

async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body;

    const response = await axios.get(usuariosRegistradosUrl, {
      headers: {
        'X-Master-Key': masterKey,
      },
    });
    const usuariosRegistrados = response.data.record;

    const usuario = usuariosRegistrados.find(user => user.email === email);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', user: usuario });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

module.exports = {
  registrarUsuario,
  iniciarSesion,
};
