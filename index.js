import express from "express"
import http from "http"
import dotenv from "dotenv"
dotenv.config()
import cookieParser from "cookie-parser"
import connection from "./conn.js"
import userRouter from "./Routers/userRouters.js"
import cors from "cors"
import ProjectRouter from "./Routers/projectRouters.js"
import packageRouter from "./Routers/packageRouter.js"
import sliderRouter from "./Routers/sliderRouter.js"
import serviceRouter from "./Routers/serviceRouters.js"


const port = process.env.PORT
const app = express()
app.use(cors({
  origin: [process.env.DOMAIN, process.env.LOCAL,"http://127.0.0.1:5173"],
  credentials: true
}
))
app.use(cookieParser())
app.use(express.json())
app.use("/api/v1/user", userRouter)
app.use("/api/v1/project", ProjectRouter)
app.use("/api/v1/package", packageRouter)
app.use("/api/v1/slider", sliderRouter),
app.use("/api/v1/service", serviceRouter)
connection().then(() => {
    app.listen(port, () => {
        console.log(`Server is Running on port: ${port}`);
    })
})  /// combined the server listener and database

