import express from "express"
import { createMessage, getMessages, markAsRead, updateMessage } from "../Controllers/messageControllers.js"
const messageRouter = express.Router()

messageRouter.post("/create", createMessage)
messageRouter.post("/all/:conversationId", getMessages)
messageRouter.put("/update/:messageId", updateMessage)
messageRouter.post("/readed", markAsRead)

export default messageRouter

// http://localhost:3000/api/v1/message/create
// http://localhost:3000/api/v1/message/all/:conversationId
// http://localhost:3000/api/v1/message/update/:id
//http://localhost:3000/api/v1/message/readed