import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js"
import authRoutes from "./routes/auth.route.js"
import postRoutes from "./routes/post.route.js"
import cookieParser from "cookie-parser"
import path from 'path';

dotenv.config()
const __dirname = path.resolve();


mongoose.connect(process.env.MONGODB)
  .then(() => console.log("db is connected")).catch(err => console.log(err))
const app = express()
app.use(express.json())
app.use(cookieParser())

app.listen(3000, () => {
  console.log("Server is runing on port 3000")
})

app.use(express.static(path.join(__dirname, '/mern-blog/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'mern-blog', 'dist', 'index.html'));
});

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Serve Error"
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})