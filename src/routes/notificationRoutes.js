import express from 'express';
import { getMyNotifications, readNotification } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODAS las rutas de notificaciones deben estar protegidas
router.use(protect);

router.get('/', getMyNotifications);
router.patch('/:id/read', readNotification);

export default router;