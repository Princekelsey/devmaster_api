const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  addReview,
} = require("../controllers/reviews");
const Review = require("../models/Reviews");
const advancedQuerry = require("../middleware/advanceQuerry");
const { protectRoute, authorizeUser } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedQuerry(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getAllReviews
  )
  .post(protectRoute, authorizeUser("user", "admin"), addReview);

router.route("/:id").get(getReview);
//   .put(protectRoute, authorizeUser("publisher", "admin"), updateCourse)
//   .delete(protectRoute, authorizeUser("publisher", "admin"), deleteCourse);

module.exports = router;
