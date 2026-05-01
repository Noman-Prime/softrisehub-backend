import User from "../Models/userModel.js";
import Emails from "../utils/emailAccounts.js";
import sendEmail from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import cloudinary from "../utils/cloudinary.js";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";


export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, country } = req.body;
        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "fill the required fields",
            });
        }
        const alreadyUser = await User.findOne({ email });
        if (alreadyUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        let imageData = null
        if (req.file) {
            const result = await cloudinaryUpload(req.file.buffer)
            imageData = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }
        const user = await User.create({
            ...req.body,
            image: imageData
        });
        return sendToken(user, 201, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        return sendToken(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200)
            .cookie("token", null, {
                expires: new Date(0),
                httpOnly: true
            })
            .json({
                success: true,
                message: "User logged out successfully",
            });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not logged In"
            })
        }

        return sendToken(user, 200, res)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getSingleUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("+role");
        let totalAccounts = users.length;
        let totalAdmin = 0;
        let totalDeveloper = 0;
        let totalUser = 0;

        users.forEach((U) => {
            if (U.role === "Admin") totalAdmin++
            else if (U.role === "Developer") totalDeveloper++
            else if (U.role === "User") totalUser++
        })
        return res.status(200).json({
            success: true,
            users,
            Total: totalAccounts,
            Admin: totalAdmin,
            Developer: totalDeveloper,
            User: totalUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const allowedUpdates = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
            country: req.body.country,
        };

        Object.assign(user, allowedUpdates);
        if (req.file) {
            if (user.image?.public_id) {
                await cloudinary.uploader.destroy(user.image.public_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path || req.file.buffer);
            user.image = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }
        await user.save();

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized",
            });
        }

        const user = await User.findById(id);
        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.image?.public_id) {
            try {
                await cloudinary.uploader.destroy(user.image.public_id)
            } catch (error) {
                console.error(error);
            }
        }
        await user.deleteOne()
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "given fields are required",
            });
        }
        if (oldPassword === newPassword) {
            return res.status(400).json({
                success: false,
                message: "New Password Must be change",
            });
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "Confirm Password must be same",
            });
        }
        const user = await User.findById(req.user._id).select("+password");

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        user.password = newPassword; // will be hashed in pre-save hook
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const forceLogoutUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin only",
            });
        }

        await User.findByIdAndUpdate(id, { $inc: { tokenVersion: 1 } });

        return res.status(200).json({
            success: true,
            message: "User has been logged out from all devices",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:3000/api/v1/user/password/reset/${resetToken}`;

        await sendEmail({
            mail: Emails.support.mail,
            pass: Emails.support.pass,
            email: user.email,
            subject: "Password Reset Link",
            text: `You requested a password reset.\n\nYour link:\n${resetUrl}\n\nIf you didn’t request this, ignore this email.`
        });

        return res.status(200).json({
            success: true,
            message: `Email has been sent to ${user.email}`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select("+password")
        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: "User is not found or token is expire"
            })
        }
        const { newPassword, confirmNewPassword } = req.body
        if (!newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: " Both fields are required"
            })
        }
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: " Both Password must be same"
            })
        }
        const isMatch = await bcrypt.compare(newPassword, user.password)
        if (isMatch) {
            return res.status(400).json({
                success: false,
                message: " You can't select this password"
            })
        }
        user.password = newPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save()
        return res.status(200).json({
            success: true,
            message: " Password is updated",
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: " Something went wrong"
        })
    }
}

export const addImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user is not found"
            })
        }
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "image is required"
            })
        }
        if (user.image?.public_id) {
            await cloudinary.uploader.destroy(user.image.public_id)
        }
        const result = await cloudinaryUpload(req.file.buffer, "SoftRiseHub/Users")
        user.image = {
            url: result.secure_url,
            public_id: result.public_id
        }
        await user.save()
        return res.status(200).json({
            success: true,
            message: "Image is uploaded"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }
}