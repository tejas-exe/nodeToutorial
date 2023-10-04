const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const tourRouter = require('./routs/tourRouts');
const userRouter = require('./routs/userRouts');
const mongoose = require('mongoose');
const ApiError = require('./Util/AppError');
dotenv.config('./.env');
const app = express();

const mongoConnect = process.env.MANGODBCONNECT.replace(
  '<password>',
  process.env.PASSWORD
);

mongoose.connect(mongoConnect).then(() => {
  console.log('===> Connect to DB');
});

process.on('unhandledRejection', () => {
  console.log('error on connection ');
  process.exit(1);
});
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.time = new Date().toISOString();
  next();
});
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new ApiError('not a valid path', 404));
});

const handleCasterrorDB = (error) => {
  const message = `invalid at path:${error.path}:objectid:${error.value}`;
  console.log('handl casee re er', message);
  return new ApiError(message, 400);
};
const handleinvalidTokenError = (error) => {
  const message = `invalid at token provided`;
  return new ApiError(message, 401);
};
const handleExpiredTokenError = (error) => {
  const message = `token expired`;
  return new ApiError(message, 401);
};

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV == 'production') {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errorOn: 'Production',
      });
    } else {
      res.status(err.statusCode).json({
        status: err.status,
        message: 'Something went wrong',
        errorOn: 'Production',
      });
    }
  } else {
    let error = err;
    if (error.name === 'CastError') error = handleCasterrorDB(error);
    if (error.name === 'JsonWebTokenError')
      error = handleinvalidTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = handleExpiredTokenError(error);
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error: error,
      stack: error.stack,
    });
    res
      .status(error.statusCode)
      .json({ status: error.status, message: error.message });
  }
});

module.exports = app;
