const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  resetPassword,
  forgotPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth");
const { protectRoute } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protectRoute, currentUser);
router.route("/updatedetails").put(protectRoute, updateDetails);
router.route("/updatepassword").put(protectRoute, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);

module.exports = router;
