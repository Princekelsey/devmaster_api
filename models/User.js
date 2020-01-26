const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const USER_SCHEMA = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  role: {
    type: String,
    enum: ["user", "publisher"],
    default: "user"
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// encrypt password
USER_SCHEMA.pre("save", async function(next) {
  const salt = await bycrpt.genSalt(10);
  this.password = await bycrpt.hash(this.password, salt);
  next();
});

// sign jwt and return
USER_SCHEMA.methods.signJWTandReturn = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// compare login password with hashed password in database
USER_SCHEMA.methods.matchPassword = async function(loginPassword) {
  return await bycrpt.compare(loginPassword, this.password);
};

module.exports = mongoose.model("User", USER_SCHEMA);
