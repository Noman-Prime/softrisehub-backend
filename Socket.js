import { Server } from "socket.io"

let io

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  })

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id)

    socket.on("joinConversation", (conversationId) => {
      socket.join(conversationId)
    })

    socket.on("sendMessage", ({ conversationId, message }) => {
      io.to(conversationId).emit("receiveMessage", {
        message
      })
    })

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id)
    })
  })
}

export default initSocket