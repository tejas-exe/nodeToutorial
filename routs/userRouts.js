const express = require('express');
const userController = require('../controller/userController');

const createUser = (req, res) => {
  res.status(500).write('not written');
};
const getUser = (req, res) => {
  res.status(500).write('not written');
};
const getUserID = (req, res) => {
  res.status(500).write('not written');
};
const updateUser = (req, res) => {
  res.status(500).write('not written');
};
const deleteUser = (req, res) => {
  res.status(500).write('not written');
};

const userRouter = express.Router();

userRouter.post('/signup', userController.signUp);
userRouter.post('/login', userController.login);
userRouter.post('/forgotPassword', userController.forgotPassword);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter.route('/api/v1/user').get(getUser).post(createUser);
userRouter
  .route('/api/v1/user/:id')
  .get(getUserID)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
