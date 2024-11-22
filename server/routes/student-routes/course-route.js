const express = require('express');
const {getAllStudentViewCoursesList, getStudentViewCourseDetails} = require('../../controllers/student-controller/course-controller')
const router = express.Router()

router.get('/get', getAllStudentViewCoursesList);
router.get('/get/details/:id/:studentId',getStudentViewCourseDetails)

module.exports = router