import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  // 1) Obtener el token y verificar si existe
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No has iniciado sesión. Por favor, ingresa para obtener acceso.', 401));
  }

  // 2) Verificar el token
  // Usamos promisify para que jwt.verify devuelva una promesa y podamos usar await
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Verificar si el usuario aún existe
  // IMPORTANTE: Acá usamos decoded.id porque así lo guardamos en el token
  const [rows] = await pool.query('SELECT * FROM users WHERE ID = ?', [decoded.id]);
  const currentUser = rows[0];

  if (!currentUser) {
    return next(new AppError('El usuario que pertenece a este token ya no existe.', 401));
  }

  // 4) DAR ACCESO A LA RUTA PROTEGIDA
  // Guardamos el usuario en el objeto request para que los siguientes controllers lo usen
  req.user = currentUser;
  next();
});