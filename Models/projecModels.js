import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startingDate: {
        type: String
    },
    endDate: {
        type: String
    },
    gitHubLink: {
        type: String,
    },
    liveLink: {
        type: String
    },
    images: [
        {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
        }
    ],
    status: {
        type: String,
        enum: ["pending","building", "completed"],
        default: "pending"
    }
}, { timestamps: true })

const project = mongoose.model("Project", projectSchema)
export default project