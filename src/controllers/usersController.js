import bcrypt from 'bcrypt';
import connection from '../config/config.js';

// Obtener todos los usuarios
export const getUsers = (req, res) => {
  connection.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: 'Failed to retrieve users' });
    } else {
      res.json(results);
    }
  });
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Generar hash de la contraseña

    connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error creating user:', err);
          res.status(500).json({ error: 'Failed to create user' });
        } else {
          res.status(201).json({ id: results.insertId });
        }
      }
    );
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
