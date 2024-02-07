import express from "express"
import { verifyToken } from "../utils/verfiyUser.js"
import { create, readPost } from "../controllers/post.controller.js"

const router = express.Router()

router.post('/create', verifyToken, create)
router.get('/read', readPost)


export default router