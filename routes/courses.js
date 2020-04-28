const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");
const Courses = require("../models/Course");
const advancedQuerry = require("../middleware/advanceQuerry");
const { protectRoute, authorizeUser } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedQuerry(Courses, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllCourses
  )
  .post(protectRoute, authorizeUser("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protectRoute, authorizeUser("publisher", "admin"), updateCourse)
  .delete(protectRoute, authorizeUser("publisher", "admin"), deleteCourse);

module.exports = router;
