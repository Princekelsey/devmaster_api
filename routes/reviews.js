const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllReviews,
  getReview,
  addReview,
  updateReview,
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

router
  .route("/:id")
  .get(getReview)
  .put(protectRoute, authorizeUser("user", "admin"), updateReview);

module.exports = router;
