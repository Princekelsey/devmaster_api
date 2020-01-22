const express = require("express");
const dotenv = require("dotenv").config({ path: "./config/config.env" });
const colors = require("colors");
const morgan = require("morgan");

const bootCamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

// connect database
connectDB();

const app = express();
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// set routers
app.use("/api/v1/bootcamps", bootCamps);
app.use("/api/v1/courses", courses);

//error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `App runing in ${process.env.NODE_ENV} and listening on port ${PORT}!`
      .yellow.bold
  );
});

// handle promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
