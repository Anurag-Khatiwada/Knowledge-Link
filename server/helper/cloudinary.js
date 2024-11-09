const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMediaToCloudinary = async (filePath)=>{
    try{
        const result  = await cloudinary.uploader.upload((filePath),{
            resource_type: "auto"
        })
        return result;
    }catch(err){
        console.log(err);
        throw new Error("There is problem uploading to cloudinary")
    }
}

const deleteMediaFromCloudinary = async (publicId)=>{
    try{
         await cloudinary.uploader.destroy(publicId)

    }catch(err){
        console.log(err);
        throw new Error("Failed to delete from cloudinary")
    }
}

module.exports = { uploadMediaToCloudinary, deleteMediaFromCloudinary}


