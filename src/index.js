import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import incidentsRoutes from './routes/incidents.js';
import usersRoutes from './routes/users.js';
import { registerUser, loginUser } from './controllers/authController.js';

const app = express();

app.use(express.json());
app.use(cors());

// Rutas de la API
app.use('/api/incidents', incidentsRoutes);
app.use('/api/users', usersRoutes);

// Rutas de autenticación directamente bajo /api
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);

// Ruta de bienvenida
app.get('/dashboard', (req, res) => {
  res.send('Welcome to the Incident Report API');
});

// Manejo de errores: middleware para capturar errores 404 y manejar otros errores
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
