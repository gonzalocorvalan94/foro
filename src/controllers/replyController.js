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
import { deleteFile } from '../utils/fileUtils.js';

export const createNewReply = catchAsync(async (req, res, next) => {
  const { threadId } = req.params;
  const thread = await getThreadById(threadId);

  if (!thread) {
    return next(new AppError('No puedes comentar en un hilo que no existe', 404));
  }

  const { content } = req.body;
  const userId = req.user.ID;

  let parentReplyId = req.body.parentReplyId;
  if (!parentReplyId || parentReplyId === '' || parentReplyId === 'null') {
    parentReplyId = null;
  } else {
    parentReplyId = Number(parentReplyId);
  }

  let imageUrl = null;
  if (req.file) {
    imageUrl = `/img/replies/${req.file.filename}`;
  }

  const replyId = await createReply(content, userId, threadId, parentReplyId, imageUrl);

  try {
    if (thread.user_id !== userId) {
      await createNotification(thread.user_id, userId, threadId, 'reply');
    }
  } catch (error) {
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
  const reply = await getReplyById(id);

  if (!reply) return next(new AppError('No existe la respuesta', 404));

  if (reply.user_id !== userId) {
    return next(new AppError('No tienes permiso para editar esto', 403));
  }

  await updateReply(id, content);
  res.status(200).json({ status: 'success', message: 'Respuesta actualizada' });
});

export const deleteReplyController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const reply = await getReplyById(id);

  if (!reply) return next(new AppError('No existe la respuesta', 404));

  if (reply.user_id !== req.user.ID && req.user.Role !== 'admin') {
    return next(new AppError('No tienes permiso', 403));
  }

  if (reply.Image_url) {
    await deleteFile(reply.Image_url);
  }

  await deleteReply(id);
  res.status(204).json({ status: 'success', data: null });
});