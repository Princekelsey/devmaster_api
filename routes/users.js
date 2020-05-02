const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/users");
const User = require("../models/User");
const advancedQuerry = require("../middleware/advanceQuerry");
const { protectRoute, authorizeUser } = require("../middleware/auth");

router.use(protectRoute);
router.use(authorizeUser("admin"));
router.route("/").get(advancedQuerry(User), getAllUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
