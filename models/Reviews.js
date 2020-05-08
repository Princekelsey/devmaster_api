const mongoose = require("mongoose");

const REVIEW_SCHEMA = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title the review"],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, "Please add a some text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating between 1 and 10 "],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Reviews", REVIEW_SCHEMA);
