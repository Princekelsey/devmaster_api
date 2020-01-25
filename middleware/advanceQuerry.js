const advancedQuerry = (model, populate) => async (req, res, next) => {
  let querry;
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(field => delete reqQuery[field]);
  let querryStr = JSON.stringify(reqQuery);
  querryStr = querryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    match => `$${match}`
  );

  querry = model.find(JSON.parse(querryStr));
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
  const total = await model.countDocuments();
  querry = querry.skip(startIndex).limit(limit);

  if (populate) {
    querry = querry.populate(populate);
  }

  const result = await querry;

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

  res.advancedQuerryResult = {
    success: true,
    count: result.length,
    pagination,
    data: result
  };

  next();
};

module.exports = advancedQuerry;
