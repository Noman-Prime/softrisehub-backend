import Package from "../Models/PackageModel.js";
import project from "../Models/projecModels.js";
import service from "../Models/ServicesModel.js";
import slider from "../Models/SliderModel.js";
import User from "../Models/userModel.js";

const model = { Package, project, service, slider, User }

const streamHandler = async (req, res) => {
    const { modelName } = req.params
    const Model = model[modelName]
    if (!Model) {
        return res.status(404).send(`${Model} not found`)
    }

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.status(200)

    const stream = Model.watch()
    stream.on("change", async () => {
        const Data = await Model.find()
        res.write(`data: ${JSON.stringify({ Data })}\n\n`)
    })
    req.on("close", () => {
        stream.close()
        res.end()
    })
}

export default streamHandler