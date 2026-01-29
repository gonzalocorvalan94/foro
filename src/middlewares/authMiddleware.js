import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import pool from '../config/db.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  // 1. Obtener el token y verificar si existe
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No estás logueado. Por favor inicia sesión.', 401));
  }

  // 2. Verificar el token
  // promisify convierte jwt.verify (que usa callbacks) en una promesa para usar await
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Verificar si el usuario aún existe en la DB
  // ¡IMPORTANTE! Aquí traemos el Role para que esté disponible en req.user
  const [rows] = await pool.query(
    'SELECT ID, Username, Email, Role FROM users WHERE ID = ?', 
    [decoded.id]
  );
  
  const currentUser = rows[0];

  if (!currentUser) {
    return next(new AppError('el usuario dueño de este token ya no existe.', 401));
  }

  // 4. Guardar el usuario en la request
  // A partir de aquí, cualquier ruta que use 'protect' tiene acceso a req.user.Role
  req.user = currentUser;
  next();
});

// Este middleware se usa DESPUÉS de protect
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // AGREGÁ ESTO PARA VER LA VERDAD EN LA CONSOLA
    console.log('ROL DEL USUARIO:', req.user.Role);
    console.log('ROLES PERMITIDOS:', roles);

    if (!roles.includes(req.user.Role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'No tienes permiso para realizar esta acción'
      });
    }
    next();
  };
};