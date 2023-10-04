const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required for sign up'], // Changed error message
  },
  email: {
    type: String,
    required: [true, 'Email is required for sign up'],
    unique: [true, 'Email already exists'],
    lowercase: true,
    validate: [validator.isEmail, 'please provide a valid email'],
  },

  photo: String,
  role: {
    type: String,
    enum: { values: ['admin', 'lead-guide', 'guide', 'user'] },
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required for sign up'], // Changed error message
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Confirm password is required for sign up'], // Changed error message
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: 'cnfpw and pw dont match',
    },
  },
  updateDate: Date,
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  } else {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.confirmPassword = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  inputPassword,
  dbPassword
) {
  return await bcrypt.compare(inputPassword, dbPassword);
};

UserSchema.methods.pwChecker = function (jwtStamp) {
  if (this.updateDate) {
    const dbPassChange = parseInt(this.updateDate.getTime() / 1000, 10);
    if (jwtStamp < dbPassChange) {
      return true;
    }
    return false;
  }
  return false;
};

const UserModal = mongoose.model('User', UserSchema);
module.exports = UserModal; // Corrected module.exports
