import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv'
import globalErrorHandler from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import AppError from './utils/AppError.js';

dotenv.config();
const app = express();

app.use(express.json())
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.use('/api/v1/users', userRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor`, 404));
});

app.use(globalErrorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
