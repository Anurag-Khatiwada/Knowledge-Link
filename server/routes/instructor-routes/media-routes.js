const express = require('express');
const multer = require("multer");

const {uploadMediaToCloudinary, deleteMediaFromCloudinary} = require("../../helper/cloudinary");

const router = express.Router()

const upload = multer({dest: 'uploads/'});

router.post('/upload', upload.single('file'), async (req,res)=>{
    try{

        const result = await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success: true,
            message: "File uploaded successfully",
            data: result
        })

    }catch(err){
        return res.status(400).json({
            success: false,
            message: "Error uploading"
        })
    }
})

router.delete('/delete/:id', async(req, res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success: false,
                message: "required assets id"
            })
        }
        await deleteMediaFromCloudinary(id);
        res.status(200).json({
            success: true,
            message: "Media deleted successfully"
        })
    }catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Error deleting"
        })
    }
} )

router.post('/bulk-upload', upload.array('file' ,10), async(req, res)=>{
    try{
        const uploadPromises = req.files.map((fileItem)=>uploadMediaToCloudinary(fileItem.path))
        const result = await Promise.all(uploadPromises);
        res.status(200).json({
            success: true,
            message: "Media deleted successfully",
            data: result
        })
    }catch(err){
        return res.status(400).json({
            success: false,
            message: "Error in uploading multiple files"
        })
    }
    
})

module.exports = router;