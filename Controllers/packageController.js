import Package from "../Models/PackageModel.js";

export const createPackage = async (req, res) => {
    try {
        const packageData = await Package.create(req.body);
        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: "Package was not created"
            });
        }
        return res.status(201).json({
            success: true,
            package: packageData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const updatePackage = async (req, res) => {
    try {
        const packageData = await Package.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true
         });
        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: "Package is not found"
            });
        }
        return res.status(200).json({
            success: true,
            package: packageData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const findPackage = async (req, res) => {
    try {
        const packageData = await Package.findById(req.params.id);
        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: "Package is not found"
            });
        }
        return res.status(200).json({
            success: true,
            package: packageData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const findAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        if (!packages || packages.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No packages found"
            });
        }
        return res.status(200).json({
            success: true,
            packages
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}

export const deletePackage = async (req, res) => {
    try {
        const packageData = await Package.findByIdAndDelete(req.params.id);
        if (!packageData) {
            return res.status(404).json({
                success: false,
                message: "Package is not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Package is deleted"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
}