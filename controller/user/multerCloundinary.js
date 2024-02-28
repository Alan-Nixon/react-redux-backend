const multer = require('multer')
const cloudinary = require('cloudinary').v2



const uploadImage = async (imageData) => {
    console.log(imageData);
    cloudinary.config({
        cloud_name: "dyh7c1wtm",
        api_key: "735384414166166",
        api_secret: "lKKu34-TvEKfl57TY5uBSHWeNo8",
    });

    const res = await cloudinary.uploader.upload(imageData, {
        resource_type: "auto",
        folder: "profile",
    });
    return res;
}

module.exports = uploadImage