// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getAllBootCamps = (req, res, next) => {
  res.status(200).json({ sucess: true, message: "Show all bootcamps" });
};

// @desc    Get a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, message: `Get bootcamp ${req.params.id}` });
};

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootCamp = (req, res, next) => {
  res.status(200).json({ sucess: true, message: "Create new bootcamp" });
};

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, message: `update bootcamp ${req.params.id}` });
};

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, message: `Delete bootcamp ${req.params.id}` });
};
