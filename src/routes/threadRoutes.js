import express from 'express';
import {
  createNewThread,
  deleteThreadController,
  getAllThreadsController,
  updateThreadController,
  getOneThread,
  getThreadDetails,
} from '../controllers/threadController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import {
  createNewReply,
  updateReplyController,
  deleteReplyController,
} from '../controllers/replyController.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

router.get('/', getAllThreadsController);
router.get('/:id', protect, getThreadDetails);        // ← eliminé el duplicado (getOneThread)
router.post('/', protect, createNewThread);
router.post('/:threadId/replies', protect, upload.single('image'), createNewReply);
router.patch('/:id', protect, updateThreadController);
router.patch('/replies/:id', protect, updateReplyController);
router.delete('/replies/:id', protect, deleteReplyController);  // ← separé los delete por path
router.delete('/:id', protect, deleteThreadController);

export default router;