const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const bootCamps = require("./routes/bootcamps");
const errorHandler = require("./middleware/error");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Load envinornment varibles
dotenv.config({ path: "./config/config.env" });

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
