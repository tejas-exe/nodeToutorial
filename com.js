// const queryobj = { ...req.query };

// // Simple filtering

// const excludes = ['page', 'limit', 'sort', 'field'];
// excludes.map((item) => delete queryobj[item]);

// // Advance filtering
// let queryString = JSON.stringify(queryobj);
// queryString = queryString.replace(
//   /\b(gte|gt|lte|lt)\b/g,
//   (match) => `$${match}`
// );
// let response = tourModal.find(JSON.parse(queryString));
// Sorting
// if (req.query.sort) {
//   const sortingArr = req.query.sort.split(',').join(' ');
//   console.log('==><', sortingArr);
//   response = response.sort(sortingArr);
// } else {
//   response = response.sort('-createdAt');
// }

// Field limiting

// if (req.query.field) {
//   const limitingArr = req.query.field.split(',').join(' ');
//   response = response.select(limitingArr);
// } else {
//   response.select('-__v');
// }

// pagination
// let page = req.query.page * 1 || 1;
// let limit = req.query.limit * 1 || 3;
// let skip = (page - 1) * limit;
// response.skip(skip).limit(limit);
// if (req.query.page) {
//   const numPage = await tourModal.countDocuments();
//   if (skip > numPage) {
//     throw new Error('page dont exists');
//   }
// }
// Exicute query
