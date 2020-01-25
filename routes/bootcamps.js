const express = require("express");
const router = express.Router();
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius,
  imageUpload
} = require("../controllers/bootcamps");
const Bootcamp = require("../models/Bootcamp");
const advancedQuerry = require("../middleware/advanceQuerry");

// other routes
const courseRouter = require("./courses");

// redirect
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedQuerry(Bootcamp, "courses"), getAllBootCamps)
  .post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);
router.route("/:id/photo").put(imageUpload);

module.exports = router;
