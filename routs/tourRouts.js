const express = require('express');
const tourRouter = express.Router();
const tourController = require('../controller/tourController');
const userModal = require('../controller/userController');

// tourRouter.param('id', tourController.checkID);
tourRouter.route('/monthlyPlan/:year').get(tourController.calculateBusyMonth);
tourRouter
  .route('/topFive')
  .get(tourController.getTheFiveCheapest, tourController.getTour);

tourRouter.route('/agg').get(tourController.aggregate);

tourRouter
  .route('/')
  .get(
    userModal.authorizeUser,
    userModal.checkRole('admin', 'lead-guide'),
    tourController.getTour
  )
  .post(tourController.checkData, tourController.addTour);

tourRouter
  .route('/:id')
  .delete(
    userModal.authorizeUser,
    userModal.checkRole('admin', 'lead-guide'),
    tourController.deleteTour
  )
  .patch(tourController.updateTour)
  .get(tourController.getTourID);

module.exports = tourRouter;
