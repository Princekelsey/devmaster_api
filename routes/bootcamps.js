const express = require("express");
const router = express.Router();
const {
  getAllBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp
} = require("../controllers/bootcamps");

router
  .route("/")
  .get(getAllBootCamps)
  .post(createBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
