import { createUser, getAllUsersFromDB, getUserByEmail, getUserByUsername, createUserWithSecurity, updatePassword } from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/emailService.js';

export const register = catchAsync(async (req, res, next) => {
  const { username, email, password, securityQuestion, securityAnswer } = req.body;

  if (!username || !email || !password || !securityQuestion || !securityAnswer) {
    return next(new AppError('Por favor, completa todos los campos', 400));
  }

  if (username.length < 4) {
    return next(new AppError('El nombre de usuario debe tener al menos 4 caracteres', 400));
  }

  if (password.length < 6) {
    return next(new AppError('La contraseña debe tener al menos 6 caracteres', 400));
  }

  // Validar que la respuesta sea una sola palabra
  if (securityAnswer.trim().includes(' ')) {
    return next(new AppError('La respuesta debe ser una sola palabra', 400));
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    return next(new AppError('El email ya está registrado', 400));
  }

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    return next(new AppError('El nombre de usuario ya está en uso', 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedAnswer = await bcrypt.hash(securityAnswer.trim().toLowerCase(), 12);

  const newUserId = await createUserWithSecurity(username, email, hashedPassword, securityQuestion, hashedAnswer);

  sendWelcomeEmail(email, username).catch(err => console.error('Email falló:', err));

  res.status(201).json({
    status: 'success',
    message: 'Usuario creado con éxito',
    data: { userId: newUserId },
  });
});

export const getSecurityQuestion = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Por favor ingresá tu email', 400));
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return next(new AppError('No existe una cuenta con ese email', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { question: user.Security_question }
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { email, securityAnswer, newPassword } = req.body;

  if (!email || !securityAnswer || !newPassword) {
    return next(new AppError('Por favor, completa todos los campos', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('La contraseña debe tener al menos 6 caracteres', 400));
  }

  if (securityAnswer.trim().includes(' ')) {
    return next(new AppError('La respuesta debe ser una sola palabra', 400));
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return next(new AppError('No existe una cuenta con ese email', 404));
  }

  const answerMatch = await bcrypt.compare(
    securityAnswer.trim().toLowerCase(),
    user.Security_answer
  );

  if (!answerMatch) {
    return next(new AppError('La respuesta es incorrecta', 401));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await updatePassword(user.ID, hashedPassword);

  res.status(200).json({
    status: 'success',
    message: 'Contraseña actualizada correctamente'
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Por favor, ingresa tu email y contraseña', 400));
  }

  const user = await getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.Password))) {
    return next(new AppError('Email o contraseña incorrectos', 401));
  }

  const token = jwt.sign({ id: user.ID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'success',
    token,
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
        role: req.user.Role
      }
    }
  });
});