const geoCoder = require("../utilis/geocoder");
const BootCamp = require("../models/Bootcamp");
const ErrorResponse = require("../utilis/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
  let querry;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(field => delete reqQuery[field]);
  let querryStr = JSON.stringify(reqQuery);
  querryStr = querryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  querry = BootCamp.find(JSON.parse(querryStr)).populate("courses");
  // select querry
  if (req.query.select) {
    const fileds = req.query.select.split(",").join(" ");
    querry = querry.select(fileds);
  }

  // sort querry
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    querry = querry.sort(sortBy);
  } else {
    querry = querry.sort("-createdAt");
  }

  // pagination querry
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootCamp.countDocuments();
  querry = querry.skip(startIndex).limit(limit);

  const bootCamps = await querry;

  // pagination
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bootCamps.length,
    pagination,
    data: bootCamps
  });
});

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootCamp });
});

// @desc    Get bootcamp with radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootCampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  // get lat and lon
  const loc = await geoCoder.geocode(zipcode);
  const lon = loc[0].longitude;
  const lat = loc[0].latitude;

  // get radius by dividing distance by earth's radius
  const radius = distance / 3963;

  const bootCamps = await BootCamp.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } }
  });

  if (bootCamps.length < 1) {
    return res.status(200).json({
      success: true,
      count: bootCamps.length,
      data: "No Bootcamp found"
    });
  }
  res.status(200).json({
    success: true,
    count: bootCamps.length,
    data: bootCamps
  });
});

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootCamp
  });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootCamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  bootCamp.remove();
  res.status(200).json({ success: true, data: "Bootcamp deleted" });
});
