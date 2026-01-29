import { getAllUsersFromDB } from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';


export const updateUserRole = catchAsync(async (req, res, next) => {
  const { id } = req.params; // El ID del usuario a modificar
  const { role } = req.body; // El nuevo rol: 'user' o 'admin'

  if (!['user', 'admin'].includes(role)) {
    return next(new AppError('Rol no válido', 400));
  }

  // Llamada al modelo para actualizar
  await pool.query('UPDATE users SET Role = ? WHERE ID = ?', [role, id]);

  res.status(200).json({
    status: 'success',
    message: `Rol del usuario actualizado a ${role}`
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await getAllUsersFromDB();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});
