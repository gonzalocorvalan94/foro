import express from 'express'
import { login, register } from '../controllers/userController.js'
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login)
router.get('/test-protegido', protect, (req,res)=>{
  res.status(200).json({
    message: `Hola ${req.user.Username} este es un mensaje privado`,
    tu_id: req.user.ID
  })
})

export default router;