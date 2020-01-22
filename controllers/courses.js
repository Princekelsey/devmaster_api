const ErrorResponse = require("../utilis/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
  let querry;
  if (req.params.bootcampId) {
    querry = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    querry = Course.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }

  const courses = await querry;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});
