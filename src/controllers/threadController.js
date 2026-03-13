import {
  createThread,
  getAllThreads,
  deleteThread,
  getThreadById,
  updateThread,
  getThreadsByCategory,
} from '../models/threadModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { getRepliesByThreadId } from '../models/replyModel.js';

export const createNewThread = catchAsync(async (req, res, next) => {
  const { title, content, categoryId } = req.body;

  if (!title || !content || !categoryId) {
    return next(new AppError('Título, contenido y categoría son obligatorios', 400));
  }

  const userId = req.user.ID;
  const threadId = await createThread(title, content, userId, categoryId);

  res.status(201).json({
    status: 'success',
    data: { threadId },
  });
});

export const getAllThreadsController = catchAsync(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const threads = await getAllThreads(limit, offset);

  res.status(200).json({
    status: 'success',
    results: threads.length,
    page,
    limit,
    data: { threads },
  });
});

export const getThreadsByCategoryController = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const threads = await getThreadsByCategory(categoryId, limit, offset);

  res.status(200).json({
    status: 'success',
    results: threads.length,
    page,
    limit,
    data: { threads },
  });
});

export const getThreadDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const thread = await getThreadById(id);

  if (!thread) {
    return next(new AppError('No se encontró el hilo', 404));
  }

  const replies = await getRepliesByThreadId(id);

  res.status(200).json({
    status: 'success',
    data: {
      thread,
      repliesCount: replies.length,
      replies,
    },
  });
});

export const updateThreadController = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.ID;
  const thread = await getThreadById(id);

  if (!thread) {
    return next(new AppError('No se encontró el hilo', 404));
  }

  if (thread.user_id !== userId) {
    return next(new AppError('No tienes permiso para editar este hilo', 403));
  }

  await updateThread(id, title, content);

  res.status(200).json({
    status: 'success',
    message: 'Hilo actualizado correctamente',
  });
});

export const deleteThreadController = catchAsync(async (req, res, next) => {
  const threadId = req.params.id;
  const userId = req.user.ID;
  const userRole = req.user.Role;
  const thread = await getThreadById(threadId);

  if (!thread) {
    return next(new AppError('No se encontró el hilo con ese ID', 404));
  }

  if (thread.user_id !== userId && userRole !== 'admin') {
    return next(new AppError('No tienes permiso para eliminar este hilo', 403));
  }

  await deleteThread(threadId);
  res.status(204).json({ status: 'success', data: null });
});