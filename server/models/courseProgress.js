const mongoose = require('mongoose');

const LectureProgresssSchema = new mongoose.Schema({
    lecturdId: String,
    viewed: Boolean,
    dateViewed: Date
})

const ProgressSchema = new mongoose.Schema({
    userId: String,
    courseId: String,
    completed: Boolean,
    completionDate: Date,
    lecturesProgress: [LectureProgresssSchema] 

})

module.exports = mongoose.model("Progress",  ProgressSchema)