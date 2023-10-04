const mongoose = require('mongoose');
const tourModal = require('../../modals/toursModal');
const fs = require('fs');
mongoose
  .connect('mongodb+srv://admin:admin12@node.yetoeyg.mongodb.net/')
  .then(() => {
    console.log('===> Connect to DB');
  })
  .catch((err) => {
    console.log(err);
  });

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));

const importData = async () => {
  try {
    await tourModal.create(tours);
  } catch (error) {
    console.log(error);
  }
};
// importData();
const deleteAll = async () => {
  try {
    await tourModal.deleteMany();
  } catch (error) {
    console.log(error);
  }
};
// deleteAll();
