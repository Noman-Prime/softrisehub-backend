import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    text: {
        type: String,
        trim: true,
        required: true
    },
    sender: {
        type: String,
        required: true,
        enum: ["Guest", "Developer", "User"]
    },
    receiver: {
        type: String,
        required: true,
        enum: ["Guest", "Developer", "User"]
    },
    attachment: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
},{timestamps: true})

const Message = mongoose.model("Messages", messageSchema)
export default Message