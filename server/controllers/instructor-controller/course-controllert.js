const Course = require('../../models/Course');

const addNewCourse = async (req, res)=>{
    try{
        console.log( req.body)
        const courseData = req.body
        console.log(courseData)

        const newlyCreatedCourse = new Course(courseData);
        const savedCourse = await newlyCreatedCourse.save();
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: savedCourse
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

const getAllCourses = async (req, res)=>{
    try{
        const courses = await Course.find();
        res.status(200).json({
            success: true,
            data: courses
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

const getCourseDetailById = async (req, res)=>{
    try{
        const courseId = req.params.id;
        console.log(courseId)
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                success: false,
                message: "course not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "success",
            data: course
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

const updateCourseById = async (req, res)=>{
    try{
        const {id} = req.params
        const updatedCourse = await Course.findByIdAndUpdate(id,{
            $set: req.body
        },
        {new: true}
    )
    if(!updatedCourse){
        return res.status(404).json({
            success: false,
            message: "course not found"
        })
    }
        res.status(200).json({
            success: true,
            message: "course updated successfully",
            data: updatedCourse
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

module.exports = {addNewCourse, getAllCourses, getCourseDetailById, updateCourseById}