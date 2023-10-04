const fs = require('fs');
const tourModal = require('../modals/toursModal.js');
const APIFeatures = require('../Util/apiFeatures.js');
const AppError = require('../Util/AppError.js');


const tours = fs.readFileSync(
  __dirname + './../dev-data/data/tours-simple.json',
  'utf-8'
);
// const remove catch block
const catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next);
};
//

exports.calculateBusyMonth = async (req, res) => {
  try {
    const year = req.params.year * 1;
    console.log('===>', year);
    const plans = await tourModal.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numofTourStarts: { $sum: 1 },
          tour: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      { $sort: { numofTourStarts: -1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: plans,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware
exports.checkID = (req, res, next, val) => {
  console.log('===>Running');
  const toursArr = JSON.parse(tours);
  if (req.params.id * 1 > toursArr.length) {
    return res.status(404).send('no such id exists');
  }
  next();
};

exports.checkData = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .send('cannot create tour package without name or price');
  }
  next();
};

// FUNCTIONS
exports.getTour = async (req, res) => {
  try {
    const features = new APIFeatures(tourModal.find(), req.query)
      .filter()
      .sort()
      .fieldLimiting()
      .pagination();
    //
    const tours = await features.query;
    res.status(200).json({
      status: 'success',
      time: req.time,
      results: tours.length,
      data: tours,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getTourID = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const find = await tourModal.findById(req.params.id);
  if (!find) {
    next(new AppError('no such id exists', 200));
  } else {
    res.status(200).json({ status: 'success', Data: find });
  }
});

exports.addTour = catchAsync(async (req, res, next) => {
  const createDocument = await tourModal.create(req.body);
  res.status(201).json({
    status: 'success',
    data: createDocument,
  });
});
exports.updateTour = async (req, res) => {
  try {
    const updateDocument = await tourModal.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(202).json({
      status: 'success',
      data: updateDocument,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const deleteDocument = await tourModal.findByIdAndDelete(req.params.id);
    res.status(202).json({
      status: 'success',
      data: deleteDocument,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.getTheFiveCheapest = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.field = 'price,price,ratingsAverage';
  next();
};

exports.aggregate = async (req, res) => {
  try {
    const aggregate = await tourModal.aggregate([
      {
        $match: { price: { $lte: 1000 } },
      },
      {
        $group: {
          _id: '$difficulty',
          averagePrice: { $avg: '$price' },
          averageRating: { $avg: '$ratingsAverage' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          numofRatings: { $sum: 1 },
        },
      },
      { $sort: { averagePrice: 1 } },
    ]);
    res.status(202).json({
      status: 'success',
      data: aggregate,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
