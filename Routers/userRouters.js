import express from "express";
import {
    createUser,
    loginUser,
    logout,
    getMyProfile,
    getSingleUser,
    getAllUsers,
    updateUser,
    deleteUser,
    updatePassword,
    forceLogoutUser,
    requestPasswordReset,
    resetPassword,
    addImage
} from "../Controllers/userControllers.js";
import { isAuthenticated, isAdmin } from "../utils/auth.js";
import multer from "multer"
import { upload } from "../utils/cloudinaryUpload.js";

const userRouter = express.Router();
userRouter.use(upload.single("image"))

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticated, logout);
userRouter.get("/me", isAuthenticated, getMyProfile);
userRouter.put("/update/:id", isAuthenticated, updateUser);
userRouter.put("/update/password", isAuthenticated, updatePassword);
userRouter.delete("/delete/:id", isAuthenticated, deleteUser);
userRouter.get("/admin/users", isAuthenticated, isAdmin("Admin"), getAllUsers);
userRouter.get("/admin/user/:id", isAuthenticated, isAdmin("admin"), getSingleUser);
userRouter.post("/admin/force-logout/:id", isAuthenticated, isAdmin("admin"), forceLogoutUser);
userRouter.post("/password/reset/request",requestPasswordReset);
userRouter.put("/password/reset/:token", resetPassword);
userRouter.put("/upload/image", isAuthenticated, upload.single("image"), addImage);


export default userRouter;

/*
📌 API Endpoints:

POST    http://localhost:3000/api/v1/user/signup               → Create a new user
POST    http://localhost:3000/api/v1/user/login                → Login user
POST    http://localhost:3000/api/v1/user/logout               → Logout current user
GET     http://localhost:3000/api/v1/user/me                   → Get logged-in user's profile
PUT     http://localhost:3000/api/v1/user/update/:id           → Update user (own profile or by admin)
PUT     http://localhost:3000/api/v1/user/update/password      → Update logged-in user's password
POST    http://localhost:3000/api/v1/user/password/reset/request → password reset request for user only
put     http://localhost:3000/api/v1/user/password/reset/:token → password reset for user only
DELETE  http://localhost:3000/api/v1/user/delete/:id           → Delete user account (own or admin)
GET     http://localhost:3000/api/v1/user/admin/users          → Get all users (admin only)
GET     http://localhost:3000/api/v1/user/admin/user/:id       → Get single user (admin only)
POST    http://localhost:3000/api/v1/user/admin/force-logout/:id → Force logout user (admin only)
put     http://localhost:3000/api/v1/user/upload/image         

*/