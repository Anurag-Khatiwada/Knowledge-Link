const express = require('express');

const router = express.Router()
const {addNewCourse, getAllCourses, getCourseDetailById, updateCourseById} = require('../../controllers/instructor-controller/course-controllert')

router.post('/add', addNewCourse);
router.get('/get', getAllCourses)
router.get('/get/details/:id', getCourseDetailById)
router.put('/update/:id', updateCourseById)


module.exports = router