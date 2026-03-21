import {
  createUser,
  getAllUsersFromDB,
  getUserByEmail,
} from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs'; // 1. Importar la librería
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/emailService.js';

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('Por favor, completa todos los campos', 400));
  }

  if (username.length < 4) {
    return next(
      new AppError('El nombre de usuario debe tener al menos 4 caracteres', 400)
    );
  }

  if (password.length < 6) {
    return next(
      new AppError('La contraseña debe tener al menos 6 caracteres', 400)
    );
  }

  const existingUser = await getUserByEmail(email);
  
  if (existingUser) {
    return next(new AppError('El email ya está registrado', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUserId = await createUser(username, email, hashedPassword);

  // Enviamos el email de bienvenida (no bloqueamos si falla)
  sendWelcomeEmail(email, username).catch((err) =>
    console.error('Email falló:', err)
  );

  res.status(201).json({
    status: 'success',
    message: 'Usuario creado con éxito',
    data: { userId: newUserId },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validar entrada
  if (!email || !password) {
    return next(new AppError('Por favor, ingresa tu email y contraseña', 400));
  }

  // 2. Buscar usuario
  const user = await getUserByEmail(email);

  // 3. Verificar si el usuario existe Y si la contraseña coincide

  if (!user || !(await bcrypt.compare(password, user.Password))) {
    return next(new AppError('Email o contraseña incorrectos', 401));
  }

  //4. Aplicar el JTW
  const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // 5. Enviar respuesta exitosa
  res.status(200).json({
    status: 'success',
    token, // <--- El cliente ahora recibe esto
    data: { user: { id: user.ID, username: user.Username } },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user.ID,
        username: req.user.Username,
        role: req.user.Role,
      },
    },
  });
});
