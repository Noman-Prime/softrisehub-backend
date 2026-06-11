import User from "../Models/userModel.js";
import slider from "../Models/SliderModel.js";
import service from "../Models/ServicesModel.js";
import project from "../Models/projecModels.js";
import Package from "../Models/PackageModel.js";

const models = {
    user: User,
    Slider: slider,
    Service: service,
    Project: project,
    package: Package,
};

const streamHandler = (req, res) => {
    const { model } = req.query;

    const TargetModel = models[model];

    if (!TargetModel) {
        return res.status(400).json({
            success: false,
            message: "Invalid model",
        });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.status(200)

    const stream = TargetModel.watch();

    const changeHandler = async () => {
        try {
            const updatedData = await TargetModel.find();
            res.write(`data: ${JSON.stringify(updatedData)}\n\n`);
        } catch (error) {
            console.error(error);
        }
    };

    stream.on("change", changeHandler);

    req.on("close", async () => {
        stream.off("change", changeHandler);
        await stream.close();
        res.end();
    });
};

export default streamHandler;