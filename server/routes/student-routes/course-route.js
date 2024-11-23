const express = require('express');
const {getAllStudentViewCoursesList, getStudentViewCourseDetails, checkCoursePurchaseInfo} = require('../../controllers/student-controller/course-controller')
const router = express.Router()

router.get('/get', getAllStudentViewCoursesList);
router.get('/get/details/:id',getStudentViewCourseDetails)
router.get('/purchase-info/:id/:studentId',checkCoursePurchaseInfo)


module.exports = router