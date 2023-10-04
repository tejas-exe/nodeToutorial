const mongoose = require('mongoose');
const slugify = require('slugify');
// CONST MONGOOSE SCHEMA
const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Should contain a name :}'],
      unique: true,
      trim: true,
      maxlength: [14, 'max words'],
      minlength: [5, 'min words'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'please  Duration of the tour'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'please  maxGroupSize of the tour'],
    },
    difficulty: {
      type: String,
      required: [true, 'please  difficulty of the tour'],
      enum: { values: ['easy', 'medium', 'difficult'], message: 'enum error' },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Should contain a price :) '],
    },

    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'the tour must have description'],
    },
    imageCover: {
      type: String,
      required: [true, 'image cover not provided'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:'invalid discount',
      },
    },
    secretTour: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

toursSchema.pre('save', function (next) {
  console.log('===>', this);
  this.slug = slugify(this.name, { lower: true });
  next();
});

toursSchema.post('save', function (doc, next) {
  next();
});

toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

toursSchema.pre('aggregate', function (next) {
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

ToursModal = mongoose.model('Tour', toursSchema);

module.exports = ToursModal;
