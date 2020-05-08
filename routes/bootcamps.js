const express = require("express");
const router = express.Router();
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
  imageUpload,
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const advancedQuerry = require("../middleware/advanceQuerry");
const { protectRoute, authorizeUser } = require("../middleware/auth");

// other routes
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

// redirect
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router
  .route("/")
  .get(advancedQuerry(Bootcamp, "courses"), getAllBootCamps)
  .post(protectRoute, authorizeUser("publisher", "admin"), createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .put(protectRoute, authorizeUser("publisher", "admin"), updateBootCamp)
  .delete(protectRoute, authorizeUser("publisher", "admin"), deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);
router
  .route("/:id/photo")
  .put(protectRoute, authorizeUser("publisher", "admin"), imageUpload);

module.exports = router;
