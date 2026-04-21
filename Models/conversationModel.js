import mongoose from "mongoose";
import { type } from "os";

const conversationSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ["Guest","User"],
        default: "Guest"
    },
    phoneNumber: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
    },
    status: {
        type: String,
        default: "Active"
    },
    isClosed : {
        type: Boolean,
        default: false
    },
    closedAt :{
        type: Date
    }
},{timestamps: true})

const Conversation = mongoose.model ("Conversations", conversationSchema)
export default Conversation