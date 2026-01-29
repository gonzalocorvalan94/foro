import { createUser, getAllUsersFromDB, getUserByEmail } from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs'; // 1. Importar la librería
import jwt from 'jsonwebtoken';



export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('Por favor, completa todos los campos', 400));
  }

  // 2. ENCRIPTACIÓN:
  // El '12' es el "cost factor". Cuanto más alto, más seguro pero más lento.
  // 12 es el equilibrio perfecto hoy en día.
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Mandamos la contraseña ENCRIPTADA al modelo, no la original
  const newUserId = await createUser(username, email, hashedPassword);

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
