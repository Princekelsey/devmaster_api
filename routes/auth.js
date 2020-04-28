const express = require("express");
const { registerUser, loginUser, currentUser } = require("../controllers/auth");
const { protectRoute } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").get(protectRoute, currentUser);

module.exports = router;
