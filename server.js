const express = require("express");
const dotenv = require("dotenv");

// Route files
const bootCamps = require("./routes/bootcamps");

// Load envinornment varibles
dotenv.config({ path: "./config/config.env" });

const app = express();

// set routers
app.use("/api/v1/bootcamps", bootCamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `App runing in ${process.env.NODE_ENV} and listening on port ${PORT}!`
  );
});
