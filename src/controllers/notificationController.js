import { getNotificationsByUser, markNotificationAsRead } from '../models/notificationModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

// 1. Obtener todas mis notificaciones
export const getMyNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user.ID; // Sacamos el ID del token (gracias al middleware protect)

  const notifications = await getNotificationsByUser(userId);

  res.status(200).json({
    status: 'success',
    results: notifications.length,
    data: { notifications }
  });
});

// 2. Marcar una notificación como leída
export const readNotification = catchAsync(async (req, res, next) => {
  const { id } = req.params; // ID de la notificación
  const userId = req.user.ID;

  const updated = await markNotificationAsRead(id, userId);

  if (!updated) {
    return next(new AppError('No se encontró la notificación o no te pertenece', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Notificación marcada como leída'
  });
});