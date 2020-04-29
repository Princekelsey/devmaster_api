const path = require("path");
const geoCoder = require("../utilis/geocoder");
const BootCamp = require("../models/Bootcamp");
const ErrorResponse = require("../utilis/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedQuerryResult);
});

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id).populate("courses");

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
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
  });

  if (bootCamps.length < 1) {
    return res.status(200).json({
      success: true,
      count: bootCamps.length,
      data: "No Bootcamp found",
    });
  }
  res.status(200).json({
    success: true,
    count: bootCamps.length,
    data: bootCamps,
  });
});

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
  //user
  req.body.user = req.user.id;

  //published bootcamps
  const publishedBootcamp = await BootCamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id ${req.user.id} have already published a bootcamp`,
        400
      )
    );
  }

  const bootCamp = await BootCamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootCamp,
  });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  let bootCamp = await BootCamp.findById(req.params.id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // check if it's the actual user
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.user.id} is not authorized to update this bootCamp`,
        401
      )
    );
  }

  bootCamp = await BootCamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
  // check if it's the actual user
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.user.id} is not authorized to delete this bootCamp`,
        401
      )
    );
  }

  bootCamp.remove();
  res.status(200).json({ success: true, data: "Bootcamp deleted" });
});

// @desc    Upload a photo for a bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private
exports.imageUpload = asyncHandler(async (req, res, next) => {
  const bootCamp = await BootCamp.findById(req.params.id);

  if (!bootCamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // check if it's the actual user
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User with id of ${req.user.id} is not authorized to update this bootCamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  if (file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new ErrorResponse(
        `Please upload an image file that is less than ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }

  file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Error uploading file`, 500));
    }
    await BootCamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    res.status(200).json({
      success: true,
      date: file.name,
    });
  });
});
