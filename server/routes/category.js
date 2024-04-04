import express from 'express';
import { verifyUser } from '../middlewares/verifyUser.js';
import { createCategory,getCategory } from '../controllers/categoryController.js';


const router = express.Router()

router.post('/create',verifyUser,createCategory)
router.get('/getCategory',getCategory)




export default router