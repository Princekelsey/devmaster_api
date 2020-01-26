const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses");
const Courses = require("../models/Course");
const advancedQuerry = require("../middleware/advanceQuerry");

router
  .route("/")
  .get(
    advancedQuerry(Courses, {
      path: "bootcamp",
      select: "name description"
    }),
    getAllCourses
  )
  .post(addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
