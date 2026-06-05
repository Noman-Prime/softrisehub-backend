import mongoose from "mongoose"
const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: [
        {
            type: String,
            trim: true
        }
    ],

},{timestamps: true})
const service = mongoose.model("service", serviceSchema)
export default service