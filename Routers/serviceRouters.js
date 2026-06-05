import express from "express"
import { createService, deleteService, findAllServices, findService, updateService } from "../Controllers/servicesController.js"
import {isAdmin, isAuthenticated} from "../utils/auth.js"
const serviceRouter = express.Router()
serviceRouter.post("/create",isAuthenticated, isAdmin("Admin"), createService)
serviceRouter.put("/update",isAuthenticated, isAdmin("Admin"), updateService)
serviceRouter.get("/get/all", findAllServices)
serviceRouter.get("/get/:id", findService)
serviceRouter.delete("/delete/:id", isAuthenticated, isAdmin("Admin"), deleteService)
export default serviceRouter