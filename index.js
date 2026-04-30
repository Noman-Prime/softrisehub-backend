import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import connection from "./conn.js"
import userRouter from "./Routers/userRouters.js"
import cors from "cors"
import ProjectRouter from "./Routers/projectRouters.js"


const port = process.env.PORT
const app = express()
app.use(cors({
  origin: [process.env.DOMAIN, "http://localhost:5173"],
  credentials: true
}
))
app.use(cookieParser())
app.use(express.json())
app.use("/api/v1/user", userRouter)
app.use("/api/v1/project", ProjectRouter)
connection().then(() => {
    app.listen(port, "0.0.0.0", () => {
        console.log(`Server is Running on port: ${port}`);
    })
})  /// combined the server listener and database

