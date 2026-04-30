import { allProjects, createProject, deleteProject, findProject, updateproject } from "../Controllers/projectControllers.js"
import express from "express"
import { upload } from "../utils/cloudinaryUpload.js";

const ProjectRouter = express.Router()
ProjectRouter.use(upload.single("images"));
ProjectRouter.post("/create", createProject)
ProjectRouter.post("/update", updateproject)
ProjectRouter.post("/find/:id", findProject)
ProjectRouter.delete("/delete/:id", deleteProject)
ProjectRouter.get("/all", allProjects)

export default ProjectRouter

// http://localhost:3000/api/v1/project/create
// http://localhost:3000/api/v1/project/update/:id
// http://localhost:3000/api/v1/project/find/:id
// http://localhost:3000/api/v1/project/delete/:id
// http://localhost:3000/api/v1/project/all