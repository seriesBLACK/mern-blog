import express from "express"
import { verifyToken } from "../utils/verfiyUser.js"
import { create, deletePost, readPost } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/read', readPost)
router.delete('/delete/:postId/:userId', verifyToken, deletePost)


export default router