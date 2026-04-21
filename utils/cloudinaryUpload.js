import cloudinary from "./cloudinary.js"
import streamifier from "streamifier"

const cloudinaryUpload = (fileBuffer, file) =>{
    const promise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder},
            (err, result) =>(err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(fileBuffer).pipe(stream)
        
    })
    return promise
}
export default cloudinaryUpload