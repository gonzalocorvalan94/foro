import express from 'express';
import { createNewThread, deleteThreadController, getAllThreadsController, updateThreadController, getOneThread, getThreadDetails } from '../controllers/threadController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { createNewReply } from '../controllers/replyController.js';
import { updateReplyController, deleteReplyController } from '../controllers/replyController.js';
import { upload } from '../utils/multerConfig.js'

const router = express.Router();

// Agregá 'protect' antes del controlador
router.get('/', getAllThreadsController)
router.get('/:id', protect, getThreadDetails);
router.get('/:id', getOneThread)
router.post('/', protect, createNewThread); 
router.post('/:threadId/replies', protect, upload.single('image'), createNewReply);
router.patch('/:id', protect, updateThreadController);
router.patch('/replies/:id', protect, updateReplyController);
router.delete('/:id', protect, deleteThreadController);
router.delete('/:id', protect, restrictTo('admin'), deleteReplyController);
export default router;