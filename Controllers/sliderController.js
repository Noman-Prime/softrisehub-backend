import slider from "../Models/SliderModel.js"
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js"
import cloudinary from "../utils/cloudinary.js"

export const createSlider = async (req, res) => {
    try {
        let imageData = null
        if (!req.file) {
            return res.status(404).json({
                success: false,
                message: "No image is being send to mutler"
            })
        }
        const result = await cloudinaryUpload(req.file.buffer, "SoftRiseHub/Sliders")
        imageData = {
            public_id: result.public_id,
            url: result.secure_url
        }

        const Slider = await slider.create({ ...req.body, image: imageData })
        if (!Slider) {
            return res.status(400).json({
                success: false,
                message: "Slider is not created"
            })
        }

        return res.status(201).json({
            success: true,
            slider: Slider
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const updateSlider = async (req, res) => {
    try {
        const { id } = req.params
        const exestingSlider = await slider.findById(id)
        if (!exestingSlider) {
            return res.status(400).json({
                success: false,
                message: `No slider is found for this ${id}`
            })
        }

        const updatedData = {
            description: req.body.description,
            button: req.body.button
        }
        if (req.file) {
            if (exestingSlider.image?.public_id) {
                await cloudinary.uploader.destroy(exestingSlider.image.public_id)
            }


            const result = await cloudinaryUpload(req.file.buffer, "SoftRiseHub/Sliders")
            updatedData.image = {
                public_id: result.public_id,
                url: result.secure_url
            }
        }
        const Slider = await slider.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
        return res.status(200).json({
            success: true,
            slider: Slider
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findSlider = async (req, res) => {
    try {
        const { id } = req.params
        const Slider = await slider.findById(id)
        if (!Slider) {
            return res.status(404).json({
                success: false,
                message: "No Slider is found"
            })
        }
        return res.status(200).json({
            success: true,
            slider: Slider
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findAllSliders = async (req, res) => {
    try {
        if (req.headers.accept === "text/event-stream") {
            res.setHeader("Content-Type", "text/event-stream")
            res.setHeader("Cache-Control", "no-cache")
            res.setHeader("Connection", "keep-alive")
            res.status(200)
            
            const changeCheck = await slider.watch()
            changeCheck.on("change", async (change) => {
                try {
                    const updatedSliders = await slider.find()
                    res.write(`data: ${JSON.stringify({ sliders: updatedSliders })}\n\n`)
                } catch (error){
                    console.log(error);   
                }
            })

            req.on("close", () => {
                changeCheck.close() 
                res.end()
            })
            return
        }

        const sliderLenght = 0
        const Sliders = await slider.find()
        if (!Sliders) {
            return res.status(404).json({
                success: false,
                message: "No data is found"
            })
        }
        return res.status(200).json({
            success: true,
            sliders: Sliders,
            sliderLenght: Sliders.length
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const deleteSlider = async (req, res) => {
    try {
        const { id } = req.params
        const Slider = await slider.findById(id)
        if (!Slider) {
            return res.status(404).json({
                success: false,
                message: "No  Data is found"
            })
        }
        if (Slider.image?.public_id) {
            await cloudinary.uploader.destroy(Slider.image.public_id, { invalidate: true })
        }
        await Slider.deleteOne()
        return res.status(200).json({
            success: true,
            message: "Slider is deleted"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}