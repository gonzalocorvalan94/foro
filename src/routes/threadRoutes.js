import express from 'express';
import {
  createNewThread,
  deleteThreadController,
  getAllThreadsController,
  updateThreadController,
  getThreadDetails,
  getThreadsByCategoryController,
} from '../controllers/threadController.js';
import { protect } from '../middlewares/authMiddleware.js';
import {
  createNewReply,
  updateReplyController,
  deleteReplyController,
} from '../controllers/replyController.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

// Rutas estáticas SIEMPRE antes que las dinámicas (:id)
router.get('/category/:categoryId', protect, getThreadsByCategoryController);
router.get('/', getAllThreadsController);
router.get('/:id', protect, getThreadDetails);

router.post('/', protect, createNewThread);
router.post('/:threadId/replies', protect, upload.single('image'), createNewReply);

router.patch('/replies/:id', protect, updateReplyController);
router.patch('/:id', protect, updateThreadController);

// replies ANTES que /:id para evitar conflicto
router.delete('/replies/:id', protect, deleteReplyController);
router.delete('/:id', protect, deleteThreadController);

export default router;