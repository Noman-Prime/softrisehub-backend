import { Server } from "socket.io"

let io

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.DOMAIN,
            credentials: true
        }
    })

    io.on("connection", (socket)=>{
        console.log("User connected: ", socket.id);
    })

    return io
}
export const getIO = () => io