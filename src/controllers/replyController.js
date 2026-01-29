import {
  createReply,
  getReplyById,
  updateReply,
  deleteReply,
} from '../models/replyModel.js';
import catchAsync from '../utils/catchAsync.js';
import { getThreadById } from '../models/threadModel.js';
import AppError from '../utils/AppError.js';
import { createNotification } from '../models/notificationModel.js';

export const createNewReply = catchAsync(async (req, res, next) => {
  console.log('--- NUEVA RESPUESTA ---');
  console.log('Body:', req.body);
  console.log('Archivo recibido:', req.file);

  const { threadId } = req.params;

  // 1. VALIDACIÓN PREVENTIVA: ¿Existe el hilo? (Hacelo antes de procesar nada más)
  const thread = await getThreadById(threadId);
  if (!thread) {
    return next(
      new AppError('No puedes comentar en un hilo que no existe', 404)
    );
  }

  const { content } = req.body;
  const userId = req.user.ID;

  // 2. Lógica de parentReplyId...
  let parentReplyId = req.body.parentReplyId;
  if (!parentReplyId || parentReplyId === '' || parentReplyId === 'null') {
    parentReplyId = null;
  } else {
    parentReplyId = Number(parentReplyId);
  }

  // 3. Manejo de imagen...
  let imageUrl = null;
  if (req.file) {
    imageUrl = `/img/replies/${req.file.filename}`;
  }

  // 4. Guardar
  const replyId = await createReply(
    content,
    userId,
    threadId,
    parentReplyId,
    imageUrl
  );

  try {
    const threadOwnerId = thread.user_id; // Suponiendo que tu modelo trae el user_id del hilo

    // Solo notificamos si el que responde NO es el dueño del hilo
    if (threadOwnerId !== userId) {
      await createNotification(threadOwnerId, userId, threadId, 'reply');
    }
  } catch (error) {
    // Logueamos el error pero no cortamos la respuesta al usuario
    console.error('Error al crear notificación:', error);
  }
  res.status(201).json({
    status: 'success',
    data: { replyId, imageUrl, message: 'Respuesta creada con éxito' },
  });
});

export const updateReplyController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.ID;

  // 1. Buscar la respuesta (necesitás crear esta función en el modelo)
  const reply = await getReplyById(id);

  if (!reply) return next(new AppError('No existe la respuesta', 404));

  // 2. ¿Es el dueño?
  if (reply.user_id !== userId) {
    return next(new AppError('No tienes permiso para editar esto', 403));
  }

  // 3. Update (necesitás crear esta función en el modelo)
  await updateReply(id, content);

  res.status(200).json({ status: 'success', message: 'Respuesta actualizada' });
});

export const deleteReplyController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reply = await getReplyById(id);

  if (!reply) return next(new AppError('No existe la respuesta', 404));

  // VALIDACIÓN DE PERMISOS (dueño o admin)
  if (reply.user_id !== req.user.ID && req.user.Role !== 'admin') {
    return next(new AppError('No tienes permiso', 403));
  }

  // AHORA: Si hay imagen, la borramos del disco
  if (reply.Image_url) {
    await deleteFile(reply.Image_url);
  }

  await deleteReply(id);
  res.status(204).json({ status: 'success', data: null });
});
