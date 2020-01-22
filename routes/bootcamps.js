const express = require("express");
const router = express.Router();
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootCampsInRadius
} = require("../controllers/bootcamps");

// other routes
const courseRouter = require("./courses");

// redirect
router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(getAllBootCamps)
  .post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

router.route("/radius/:zipcode/:distance").get(getBootCampsInRadius);

module.exports = router;
