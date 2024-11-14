const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: String,
    freePreview: Boolean,
    videoUrl: String,
    public_id: String,
})

const CourseSchema = new mongoose.Schema({
    instructorId: String,
    instructorName: String,
    date: Date,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    pricing: Number,
    image: String,
    welcomeMessage: String,
    objectives: String,
    students : [
        {
            studentId: String,
            studentName: String,
            studentEmail: String,
            paidAmount: String,
        }
    ],
    curriculum: [LectureSchema],
    isPublished: Boolean

})

module.exports = mongoose.model("Course", CourseSchema)