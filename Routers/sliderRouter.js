import express from "express"
import { isAdmin, isAuthenticated } from "../utils/auth.js"
import { createSlider, deleteSlider, findAllSliders, findSlider, updateSlider } from "../Controllers/sliderController.js"
import { upload } from "../utils/cloudinaryUpload.js"
const sliderRouter = express.Router()
sliderRouter.post("/create", upload.single("image"), createSlider),
sliderRouter.put("/update/:id", isAuthenticated, isAdmin("Admin"), updateSlider),
sliderRouter.get("/allsliders", findAllSliders),
sliderRouter.get("/getslider/:id", findSlider),
sliderRouter.delete("/delete/slider/:id", isAuthenticated, isAdmin("Admin"), deleteSlider)

export default sliderRouter

// API
// http://localhost:3000/api/v1/slider/create
// http://localhost:3000/api/v1/slider/update/:id
// http://localhost:3000/api/v1/slider/allsliders
// http://localhost:3000/api/v1/slider/getslider/:id
// http://localhost:3000/api/v1/slider/delete/slider/:id
