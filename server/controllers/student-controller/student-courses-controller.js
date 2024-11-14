const StudentCourses = require('../../models/StudentCourses');

const getCoursesByStudentId = async(req, res)=>{
    try{
        const {studentId} = req.params;
        const studentCourses = await StudentCourses.findOne({userId: studentId});
        if(!studentCourses){
            return res.status(404).json({
                success: false,
                message: 'No courses found for this student'});
        }
        return res.status(200).json({
            success: true,
            message: "student courses found succesfully",
            data: studentCourses
        })
    }catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

module.exports = {getCoursesByStudentId}