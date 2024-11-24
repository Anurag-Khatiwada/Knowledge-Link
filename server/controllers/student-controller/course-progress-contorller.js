const CourseProgress = require('../../models/courseProgress');
const Course = require('../../models/Course');
const StudentCourses = require('../../models/StudentCourses');

// Mark current lecture as viewed
const markCurrentLectureAsViewed = async (req, res) => {
    try {
        const { userId, courseId, lectureId } = req.body;

        if (!userId || !courseId || !lectureId) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        let progress = await CourseProgress.findOne({ userId, courseId });
        if (!progress) {
            progress = new CourseProgress({
                userId,
                courseId,
                lecturesProgress: [
                    {
                        lectureId,
                        viewed: true,
                        dateViewed: new Date(),
                    },
                ],
            });
            await progress.save();
        } else {
            const lectureProgress = progress.lecturesProgress.find(
                (item) => item.lectureId === lectureId
            );

            if (lectureProgress) {
                lectureProgress.viewed = true;
                lectureProgress.dateViewed = new Date();
            } else {
                progress.lecturesProgress.push({
                    lectureId,
                    viewed: true,
                    dateViewed: new Date(),
                });
            }
            await progress.save();
        }

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // Check if all the lectures are viewed
        const allLecturesViewed =
            progress.lecturesProgress.length === course.curriculum.length &&
            progress.lecturesProgress.every((item) => item.viewed);

        if (allLecturesViewed) {
            progress.completed = true;
            progress.completionDate = new Date();
            await progress.save();
        }

        res.status(200).json({
            success: true,
            message: "Lecture marked as viewed",
            data: progress,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Get current course progress
const getCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const studentPurchasedCourses = await StudentCourses.findOne({ userId: userId });

        const isCurrentCoursePurchasedByCurrentUserOrNot =
            studentPurchasedCourses?.courses?.findIndex((item) => item.courseId === courseId) > -1;

        if (!isCurrentCoursePurchasedByCurrentUserOrNot) {
            return res.status(400).json({
                success: false,
                data: {
                    isPurchased: false,
                },
                message: "You need to purchase this course to access it.",
            });
        }

        const currentUserCourseProgress = await CourseProgress.findOne({
            userId,
            courseId,
        });

        if (!currentUserCourseProgress || currentUserCourseProgress?.lecturesProgress?.length === 0) {
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "No progress found. You can start watching the course.",
                data: {
                    courseDetails: course,
                    progress: [], // Indicating no progress
                    isPurchased: true,
                    notStarted: true, // Add this flag
                },
            });
        }

        const courseDetails = await Course.findById(courseId);

        res.status(200).json({
            success: true,
            message: "Course progress found",
            data: {
                courseDetails,
                progress: currentUserCourseProgress.lecturesProgress,
                completed: currentUserCourseProgress.completed,
                completionDate: currentUserCourseProgress.completionDate,
                isPurchased: true,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

// Reset course progress
const resetCurrentCourseProgress = async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
            });
        }

        const progress = await CourseProgress.findOne({ userId, courseId });

        if (!progress) {
            return res.status(404).json({
                success: false,
                message: "Progress not found!",
            });
        }

        progress.lecturesProgress = [];
        progress.completed = false;
        progress.completionDate = null;

        await progress.save();

        res.status(200).json({
            success: true,
            message: "Course progress has been reset",
            data: progress,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

module.exports = {
    markCurrentLectureAsViewed,
    getCurrentCourseProgress,
    resetCurrentCourseProgress,
};
