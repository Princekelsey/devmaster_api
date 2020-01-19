const express = require("express");
const dotenv = require("dotenv");

// Load envinornment varibles
dotenv.config({ path: "./config/config.env" });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `App runing in ${process.env.NODE_ENV} and listening on port ${PORT}!`
  );
});
