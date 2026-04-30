import { response } from "express"
import project from "../Models/projecModels.js"
import axios from "axios"
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js"
import cloudinary from "../utils/cloudinary.js"
import { io } from "../Socket/socket.js"

export const createProject = async (req, res) => {
    try {
        const { name, description, startingDate, endDate, gitHubLink, liveLink } = req.body
        let imageData = null
        if (req.file) {
            const result = await cloudinaryUpload(req.file.buffer)
            imageData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        const Project = await project.create({
            ...req.body,
            images: imageData ? [imageData] : []
        })
        if (!Project) {
            return res.status(400).json({
                success: false,
                message: "Project is not created"
            })
        }
        io.emit("projectUpdated")
        return res.status(201).json({
            success: true,
            message: "project is created",
            Project
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const updateproject = async (req, res) => {
    try {
        const { oldPublic_id } = req.body
        const Project = await project.findById(req.params.id)

        if (!Project) {
            return res.status(400).json({
                success: false,
                message: "Project not found"
            })
        }

        Object.assign(Project, req.body)

        if (req.file) {
            if (Project.images && Project.images.length > 0) {
                const oldImageIndex = Project.images.findIndex(img => img.public_id === oldPublic_id)

                if (oldImageIndex === -1) {
                    return res.status(400).json({
                        success: false,
                        message: "No matching image found to replace"
                    })
                } else {
                    await cloudinary.uploader.destroy(oldPublic_id)
                    const result = await cloudinaryUpload(req.file.buffer)
                    Project.images[oldImageIndex] = {
                        public_id: result.public_id,
                        url: result.secure_url
                    }
                }
            }
        }
        await Project.save()
        io.emit("projectUpdated")
        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            Project
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const findProject = async (req, res) => {
    try {
        const Project = await project.findById(req.params.id)
        if (!Project) {
            return res.status(400).json({
                success: true,
                message: "No project is found"
            })
        }
        return res.status(200).json({
            success: true,
            Project
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const deleteProject = async (req, res) => {
    try {
        const Project = await project.findById(req.params.id)
        if (!Project) {
            return res.status(404).json({
                success: false,
                message: "Project is not found or deleted"
            })
        }
        for (const img of Project.images) {
            await cloudinary.uploader.destroy(img.public_id)
        }
        await Project.deleteOne()
        io.emit("projectUpdated")
        return res.status(200).json({
            success: true,
            message: "Project is deleted"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}

export const allProjects = async (req, res) => {
    try {
        const Projects = await project.find()
        if (!Projects || Projects.length === 0) {
            return res.status(400).json({
                success: true,
                message: "No Project is found"
            })
        }
        return res.status(200).json({
            success: true,
            Projects,
            totalProjects: Projects.length
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}
