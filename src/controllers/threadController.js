import {
  createThread,
  getAllThreads,
  deleteThread,
  getThreadById,
  updateThread,
} from '../models/threadModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createNewThread = catchAsync(async (req, res, next) => {
  const { title, content, categoryId } = req.body;

  const userId = req.user.ID;

  const threadId = await createThread(title, content, userId, categoryId);

  res.status(201).json({
    status: 'success',
    data: { threadId },
  });
});

export const getAllThreadsController = catchAsync(async (req, res, next) => {
  const threads = await getAllThreads(); // Suponiendo que importaste el modelo

  res.status(200).json({
    status: 'success',
    results: threads.length,
    data: { threads },
  });
});


export const updateThreadController = catchAsync(async(req, res, next) => {
  const { id } = req.params; // Suponiendo que en la ruta usaste /:id
  const { title, content } = req.body;
  const userId = req.user.ID;

  const thread = await getThreadById(id);

  if (!thread) {
    return next(new AppError('No se encontró el hilo', 404));
  }

  if (thread.user_id !== userId) {
    return next(new AppError('No tienes permiso para editar este hilo', 403));
  }

  // Ahora sí, mandamos los 3 datos necesarios
  await updateThread(id, title, content);

  res.status(200).json({
    status: 'success',
    message: 'Hilo actualizado correctamente'
  });
});


export const deleteThreadController = catchAsync(async (req, res, next) => {
  const threadId = req.params.id;
  const userId = req.user.ID;

  const thread = await getThreadById(threadId);

  if (!thread) {
    return next(new AppError('No se encontró el hilo con ese ID', 400));
  }

  if (thread.user_id !== userId) {
    return next(
      new AppError('No tienes permiso para eliminar este hilo. No es tuyo', 403)
    );
  }

  await deleteThread(threadId);

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
