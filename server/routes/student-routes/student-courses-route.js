const express = require('express');
const router = express.Router();
const {getCoursesByStudentId} = require('../../controllers/student-controller/student-courses-controller');

router.get('/get/:studentId',getCoursesByStudentId);

module.exports = router