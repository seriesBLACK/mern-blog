import express from "express";
import { deleteUser, getUsers, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verfiyUser.js";

const router = express.Router()

router.get('/test', test)
router.put('/update/:userId', verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.get('/getUsers', verifyToken, getUsers)

export default router;