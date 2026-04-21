import { randomInt } from "crypto"
import Conversation from "../Models/conversationModel.js"
import sendEmail from "../utils/sendEmail.js"
import Emails from "../utils/emailAccounts.js"
import jwt from "jsonwebtoken"

export const startConvesation = async (req, res) => {
    try {
        const genPin = randomInt(1000, 10000)
        console.log(genPin)

        const { firstName, lastName, email, phoneNumber } = req.body

        await sendEmail({
            mail: Emails.support.mail,
            pass: Emails.support.pass,
            email: email,
            subject: "Conversation Pin",
            text: `Conversation Pin is: ${genPin}`
        })

        const tempToken = jwt.sign(
            { firstName, lastName, email, phoneNumber, pin: genPin },
            process.env.SECRET_KEY,
            { expiresIn: "10m" }
        )

        return res.status(201).json({
            success: true,
            message: "Conversation started",
            tempToken
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const verifyPin = async (req, res) => {
    try {
        const { tempToken, pin } = req.body

        if (!tempToken) {
            return res.status(400).json({
                success: false,
                message: "Token missing"
            })
        }

        const decoded = jwt.verify(tempToken, process.env.SECRET_KEY)

        const isVerified = Number(pin) === decoded.pin

        if (!isVerified) {
            return res.status(400).json({
                success: false,
                message: "Pin is wrong"
            })
        }

        const conversation = await Conversation.create({
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            phoneNumber: decoded.phoneNumber
        })

        return res.status(201).json({
            success: true,
            message: "Conversation created",
            conversation
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findConversation = async (req, res) => {
    try {
        const { conversationId } = req.body

        const conversation = await Conversation
            .findById(conversationId)
            .select("+status")

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "No conversation found"
            })
        }

        if (conversation.status !== "Active") {
            return res.status(400).json({
                success: false,
                message: "Conversation has been closed"
            })
        }

        return res.status(200).json({
            success: true,
            conversation
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const endConvesation = async (req, res) => {
    try {
        const { id } = req.body
        const conversation = await Conversation.findByIdAndUpdate(
            id,
            {
                status: "Closed",
                isClosed: true,
                closedAt: Date.now()
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        )
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Conversation closed successfully",
            conversation
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const findAllConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find().select("+status")

        if (!conversations || conversations.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No conversation found"
            })
        }

        return res.status(200).json({
            success: true,
            conversations,
            totalConversations: conversations.length
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}