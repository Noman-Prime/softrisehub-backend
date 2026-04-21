import express from "express"
import { endConvesation, findAllConversations, findConversation, startConvesation, verifyPin } from "../Controllers/conversationController.js"
const conversationRouter = express.Router()
conversationRouter.post("/start", startConvesation)
conversationRouter.post("/verifypin", verifyPin)
conversationRouter.post("/find", findConversation)
conversationRouter.post("/all", findAllConversations)
conversationRouter.post("/end", endConvesation)

export default conversationRouter

// http://localhost:3000/api/v1/conversation/start
// http://localhost:3000/api/v1/conversation/verifypin
// http://localhost:3000/api/v1/conversation/find
// http://localhost:3000/api/v1/conversation/all
// http://localhost:3000/api/v1/conversation/end