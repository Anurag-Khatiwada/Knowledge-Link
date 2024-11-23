const express  = require('express');
const router = express.Router();
const {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress
    }  = require('../../controllers/student-controller/course-progress-contorller')

    router.get("/get/:userId/:courseId", getCurrentCourseProgress);
    router.post("/mark-lecture-viewed", markCurrentLectureAsViewed);
    router.post("/reset-progress", resetCurrentCourseProgress);

module.exports = router