import express from 'express'
import { test, updateUser, deleteUser, getUserlisting,getUser } from '../controllers/userController.js'
import { verifyUser } from '../middlewares/verifyUser.js'

const router = express.Router()

router.get('/test-api', test)
router.post('/update/:id', verifyUser, updateUser)
router.delete('/deleteUser/:id', verifyUser, deleteUser)
router.get('/listings/:id', verifyUser, getUserlisting)
router.get('/:id',verifyUser,getUser)


export default router