import {
  createThread,
  getAllThreads,
  deleteThread,
  getThreadById,
  updateThread,
} from '../models/threadModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { getRepliesByThreadId } from '../models/replyModel.js';

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
  // 1. Obtener parámetros de la URL (Query Strings)
  // Si no vienen, por defecto mostramos la página 1 con 10 hilos
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  
  // 2. Calcular el salto (OFFSET)
  // Si estoy en la pag 1: (1-1) * 10 = 0 (no salta nada)
  // Si estoy en la pag 2: (2-1) * 10 = 10 (salta los primeros 10)
  const offset = (page - 1) * limit;

  // 3. Llamar al modelo pasando los nuevos parámetros
  // OJO: Tenés que ir a tu threadModel y actualizar la función getAllThreads
  const threads = await getAllThreads(limit, offset); 

  res.status(200).json({
    status: 'success',
    results: threads.length,
    page,       // Le devolvemos en qué página está
    limit,      // Y cuántos pedimos
    data: { threads },
  });
});

export const updateThreadController = catchAsync(async (req, res, next) => {
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
    message: 'Hilo actualizado correctamente',
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

export const getOneThread = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // 1. Buscamos el hilo
  const thread = await getThreadById(id); // La que ya tenías

  if (!thread) {
    return next(new AppError('No se encontró el hilo', 404));
  }

  // 2. Buscamos sus respuestas
  const replies = await getRepliesByThreadId(id);

  
  // 3. Mandamos TODO junto
  res.status(200).json({
    status: 'success',
    data: {
      thread,
      replies, // <--- Acá viaja el array de comentarios
    },
  });
});


export const getThreadDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params; //

  // 1. Traer el hilo usando el nombre REAL de tu función en el modelo
  const thread = await getThreadById(id); // Cambié getThreadWithAuthor por getThreadById
  
  if (!thread) {
    return next(new AppError('No se encontró el hilo', 404)); //
  }

  // 2. Traer todas las respuestas (esta sí existe en tu modelo)
  const replies = await getRepliesByThreadId(id); //

  // 3. Respuesta al cliente
  res.status(200).json({
    status: 'success',
    data: {
      thread,
      repliesCount: replies.length, //
      replies
    }
  });
});