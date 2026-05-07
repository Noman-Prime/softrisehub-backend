import mongoose from "mongoose";
const connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            family: 4 // This forces IPv4 and fixes the timeout issue
        });
        console.log("connection is successful");
    } catch (error) {
        console.error(error);
        console.log("connection is failed");
    }
}

export default connection;