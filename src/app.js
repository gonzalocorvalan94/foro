import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import globalErrorHandler from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import threadRoutes from './routes/threadRoutes.js';
import authRoutes from './routes/authRoutes.js';
import AppError from './utils/AppError.js';

// Configuración de rutas para módulos ES (importante para path.join)
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. MIDDLEWARES GLOBALES
app.use(cors());

// Configuración de Helmet ajustada para permitir recursos locales (tus fotos)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Desactivado para facilitar el desarrollo
  })
);

app.use(morgan('dev'));
app.use(express.json());

// 2. ARCHIVOS ESTÁTICOS
// Esta línea sirve todo lo que esté en public (incluyendo img/replies)
app.use(express.static(path.join(__dirname, '..', 'public')));

// 3. RUTAS DE LA API
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/threads', threadRoutes);

// 4. MANEJO DE RUTAS NO ENCONTRADAS (404)
// Debe ir DESPUÉS de las rutas y los estáticos
app.use((req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor`, 404));
});

// 5. MANEJADOR DE ERRORES GLOBAL
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
  console.log(`Directorio de estáticos real: ${path.join(__dirname, '..', 'public')}`);
});

export default app;

