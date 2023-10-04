const UserModal = require('../modals/userModal');
const jwt = require('jsonwebtoken');
const ApiError = require('../Util/AppError');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

// const testUser = async () => {
//   try {
// const user = {
//   email: 'test2@gmail.com',
//   name: 'name',
//   photos: 'photos.com',
//   password: '12345678',
//   confirmPassword: '12345678', // Corrected spelling to confirmPassword
// };

//     const createdUser = await userModel.create(user); // Changed variable name to createdUser
//     console.log(createdUser);
//   } catch (error) {
//     console.error(error.message); // Use console.error for errors
//   }
// };

// testUser();
const catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(next);
};

exports.signUp = catchAsync(async (req, res) => {
  const newUser = await UserModal.create({
    email: req.body.email,
    name: req.body.name,
    photos: req.body.photos,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    updateDate: req.body.updateDate,
    role: req.body.role,
  });
  const token = jwt.sign({ id: newUser._id }, 'userauth', { expiresIn: '30s' });
  res.status(201).json({ status: 'Successful', token, data: newUser });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    console.log('here1');
    next(new ApiError('please provide email and pass', 400));
  }
  let user = await UserModal.findOne({ email: email }).select('+password');
  console.log(password, user.password);
  if (!user || !(await user.correctPassword(password, user.password))) {
    next(new ApiError('please provide a valid email and pass', 400));
  }
  // , { expiresIn: 30000 }
  const token = jwt.sign({ id: user._id }, 'userauth', { expiresIn: 30000 });
  res.status(200).json({ status: 'sucessfull', token: token });
});

exports.authorizeUser = catchAsync(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const token = req.headers.authorization;
    const tokenDecoded = token.split(' ')[1];
    if (!tokenDecoded) {
      return next(new ApiError('user not logged in', 401));
    }
    const approveToken = await promisify(jwt.verify)(tokenDecoded, 'userauth');
    console.log('=AT=>', approveToken);
    const userExists = await UserModal.findById(approveToken.id);
    if (!userExists) {
      return next(new ApiError('no such user exists', 401));
    }

    if (userExists.pwChecker(approveToken.iat)) {
      // return next(new ApiError('password was changed', 401));
    }

    req.user = userExists;
    next();
  } else {
    return next(new ApiError('missing auth token', 401));
  }
});

exports.checkRole = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(
        new ApiError(
          'you dont have the correct rights to access this resource or operation',
          403
        )
      );
    }
    next();
  };
};

exports.forgotPassword = ()=>{}
exports.resetPassword  = ()=>{}