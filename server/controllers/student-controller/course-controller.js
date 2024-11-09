
const Courses = require('../../models/Course')
const getAllStudentViewCoursesList = async(req,res)=>{
    try{
        const coursesList = await Courses.find({});

        if(!coursesList){
            return res.status(404).json({
                success: false,
                message:"No course found"
            })
        }
        res.status(200).json({
            success: true,
            data: coursesList
        })
    }catch(err){
        console.log(err);
        res.staus(500).json({
            success: false,
            message: 'some error occured!'
        })
    }
}

const getStudentViewCourseDetails = async(req,res)=>{
    try{
        const {id} = req.params;

        const courseDetails = await Courses.findById(id);
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message:"No course found",
                data: null
            })
        }
        res.status(200).json({
            success: true,
            data: courseDetails
        })
    }catch(err){
        console.log(err);
        res.staus(500).json({
            success: false,
            message: 'some error occured!'
        })
    }
}

module.exports = {getAllStudentViewCoursesList, getStudentViewCourseDetails}