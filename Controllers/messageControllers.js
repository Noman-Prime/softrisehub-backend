import Message from "../Models/messageModels.js";
import Conversation from "../Models/conversationModel.js";

export const createMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ 
                success: false, 
                message: "Chat session not found" 
            });
        }

        if (conversation.isClosed || conversation.status === "Closed") {
            return res.status(403).json({ 
                success: false, 
                message: "This session has ended. Please start a new inquiry." 
            });
        }
        let sender
        let receiver
        if (req.user){
            sender = "Admin"
            receiver = "Guest"
        } else{
            sender = "Guest"
            receiver = "Admin"
        }
        const message = await Message.create({
            conversationId,
            text,
            sender,
            receiver
        });
        
        conversation.updatedAt = new Date();
        await conversation.save();

        return res.status(201).json({
            success: true,
            message: "Message sent",
            data: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to send message" 
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Could not fetch messages" 
        });
    }
};

export const updateMessage = async(req, res) =>{
    try {
        const {text} = req.body
        const message = await Message.findById(req.params.id,req.body,{new: true, runValidators: true})
        if(!message){
            return res.status(400).json({
                success: false,
                message: "text is not found"
            })
        }
        return res.status(200).json({
            success: true,
            message
        })
    } catch (error) {
        console.error();
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Message.updateMany(
            { conversationId, isRead: false },
            { $set: { isRead: true } }
        );

        return res.status(200).json({
            success: true,
            message: "Messages marked as read"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Update failed" 
        });
    }
};