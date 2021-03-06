const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const colors = require("colors");

// load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Rewiews = require("./models/Reviews");

// connect to database
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// read bootcamps json file
const bootCamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);

// load data to database
const saveData = async () => {
  try {
    await Bootcamp.create(bootCamps);
    await Course.create(courses);
    await User.create(users);
    await Rewiews.create(reviews);
    console.log("Data loaded".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message.red);
  }
};

// Delete data from database
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Rewiews.deleteMany();
    console.log("Data deleted".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error.message.red);
  }
};

// intialize
if (process.argv[2] === "-i") {
  saveData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
