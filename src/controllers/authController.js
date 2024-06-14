import connection from '../config/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: '1h'
  });
};

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to register user' });
          }
  
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export const loginUser = (req, res) => {
    const { email, password } = req.body;
  
    // Buscar el usuario por email en la base de datos
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      // Verificar si el usuario existe
      if (!results.length) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      // Comparar la contraseña proporcionada con la contraseña hash en la base de datos
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      // Generar token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
  
      res.json({ token });
    });
  };