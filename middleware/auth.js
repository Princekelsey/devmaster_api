const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utilis/errorResponse");
const User = require("../models/User");

exports.protectRoute = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  }
  //   else if (req.cookies.token) {
  //       token = req.cookies.token
  //   }

  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
