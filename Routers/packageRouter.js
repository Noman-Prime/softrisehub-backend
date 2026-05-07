import express from "express"
import { createPackage, deletePackage, findAllPackages, findPackage, updatePackage } from "../Controllers/packageController.js"
import { isAdmin, isAuthenticated } from "../utils/auth.js"
const packageRouter = new express.Router()

packageRouter.post("/create", isAuthenticated, isAdmin("Admin") ,createPackage)
packageRouter.put("/update/:id", isAuthenticated, isAdmin("Admin"), updatePackage)
packageRouter.get("/findAll", isAuthenticated, isAdmin("Admin"), findAllPackages)
packageRouter.get("/find/:id", isAuthenticated, isAdmin("Admin"), findPackage)
packageRouter.delete("delete/:id", isAuthenticated, isAdmin("Admin"), deletePackage)

export default packageRouter

//  http://localhost:3000/api/v1/package/create
//  http://localhost:3000/api/v1/package/update/:id
//  http://localhost:3000/api/v1/package/findAll
//  http://localhost:3000/api/v1/package/find/:id
//  http://localhost:3000/api/v1/package/delete/:id