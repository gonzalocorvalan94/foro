import express from 'express';
import { createNewThread, deleteThreadController, getAllThreadsController, updateThreadController } from '../controllers/threadController.js';
import { protect } from '../middlewares/authMiddleware.js'; // <--- Importalo

const router = express.Router();

// Agregá 'protect' antes del controlador
router.post('/createNewThread', protect, createNewThread); 
router.get('/', getAllThreadsController)
router.patch('/:id', protect, updateThreadController);
router.delete('/:id', protect, deleteThreadController);

export default router;