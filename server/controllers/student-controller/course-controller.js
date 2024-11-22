const Courses = require("../../models/Course");
const StudentCourses = require('../../models/StudentCourses')

const getAllStudentViewCoursesList = async (req, res) => {
  try {
    const {
      category = "",
      level = "",
      primaryLanguage = "",
      sortBy = "price-lowtohigh",
    } = req.query;

    let filter = {};

    // Handle categories, levels, and primaryLanguages if they exist
    if (category) {
      filter.category = { $in: category.split(",") }; // Split the string into an array
    }
    if (level) {
      filter.level = { $in: level.split(",") }; // Split the string into an array
    }
    if (primaryLanguage) {
      filter.primaryLanguage = { $in: primaryLanguage.split(",") }; // Split the string into an array
    }

    // Handle sorting logic
    let sortParams = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sortParams.pricing = 1; // Sort by price in ascending order
        break;

      case "price-hightolow":
        sortParams.pricing = -1; // Sort by price in descending order
        break;

      case "title-atoz":
        sortParams.title = 1; // Sort by title in ascending order (A-Z)
        break;

      case "title-ztoa":
        sortParams.title = -1; // Sort by title in descending order (Z-A)
        break;

      default:
        sortParams.pricing = 1; // Default sorting by price (low to high)
        break;
    }

    // Find courses with applied filters and sorting
    const coursesList = await Courses.find(filter).sort(sortParams);

    // Return the filtered and sorted courses
    res.status(200).json({
      success: true,
      data: coursesList,
    });
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses.",
    });
  }
};

const getStudentViewCourseDetails = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const courseDetails = await Courses.findById(id);
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "No course found",
        data: null,
      });
    }

    //check if the current student purchased this course or not
    const studentCourses = await StudentCourses.findOne({userId: studentId})
    const ifStudentAreadyBoughtCurrentCourse = studentCourses.courses.findIndex(item=> item.courseId === id) > -1
    console.log(ifStudentAreadyBoughtCurrentCourse)

    res.status(200).json({
      success: true,
      data: courseDetails,
      coursePurchsedId: ifStudentAreadyBoughtCurrentCourse ? id : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An error occurred!",
    });
  }
};

module.exports = { getAllStudentViewCoursesList, getStudentViewCourseDetails };
