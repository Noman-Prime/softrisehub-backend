import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connection from "./conn.js"
import userRouter from "./Routers/userRouters.js"
import cors from "cors"
import conversationRouter from "./Routers/conversationRouters.js"
import messageRouter from "./Routers/messageRouters.js"
import http from "http"
import initSocket from "./Socket.js"


dotenv.config()
const port = process.env.PORT || 3000
const app = express()
const server = http.createServer(app)
initSocket(server)
app.use(cors({
  origin: process.env.DOMAIN,
  credentials: true
}
))
app.use(cookieParser())
app.use(express.json())
app.use("/api/v1/user", userRouter)
app.use("/api/v1/conversation", conversationRouter)
app.use("/api/v1/message", messageRouter)
connection().then(() => {
    server.listen(port, "0.0.0.0", () => {
        console.log(`Server is Running on port: ${port}`);
    })
})  /// combined the server listener and database

