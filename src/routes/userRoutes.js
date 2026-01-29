import express from 'express'
import { getAllUsers,  updateUserRole } from '../controllers/userController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.get('/all-users', protect, restrictTo('admin'), getAllUsers);
router.patch('/update-role/:id', protect, restrictTo('admin'), updateUserRole);
router.get('/test-protegido', protect, (req,res)=>{
  res.status(200).json({
    message: `Hola ${req.user.Username} este es un mensaje privado`,
    tu_id: req.user.ID
  })
})

export default router;