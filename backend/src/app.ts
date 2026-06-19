import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dashboardRoutes from './routes/dashboard.routes';
import proyectosRoutes from './routes/proyectos.routes';
import tareasRoutes from './routes/tareas.routes';
import usuariosRoutes from './routes/usuarios.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  }),
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'API de gestor de proyectos operativa',
    data: {},
  });
});

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/tareas', tareasRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

