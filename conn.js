import mongoose from "mongoose";

const connection = async () =>{
    try {
        const responce = await mongoose.connect(process.env.DB_URL)
        if(responce){
            console.log("connection is successful");
        }
    } catch (error) {
        console.log("connection is failed");
    }
}
export default connection