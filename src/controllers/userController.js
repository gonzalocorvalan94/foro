import { createUser } from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

// Agregamos export, async y los parámetros (req, res, next)
export const register = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(new AppError('Por favor, completa todos los campos', 400));
  }

  // TODO: Encriptar password con bcrypt antes de mandarla al modelo
  const newUserId = await createUser(username, email, password);

  res.status(201).json({
    status: 'success',
    message: 'Usuario creado con éxito',
    data: {
      userId: newUserId
    }
  });
});