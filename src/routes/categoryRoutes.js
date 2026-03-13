import express from 'express';
import { getAllCategoriesController } from '../controllers/categoryController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllCategoriesController);

export default router;