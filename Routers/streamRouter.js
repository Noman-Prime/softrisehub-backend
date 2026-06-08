import express from "express"
import streamHandler from "../Controllers/streamController.js"

const streamRouter = express.Router()
streamRouter.get("/stream/:modelName", streamHandler)

export default streamRouter