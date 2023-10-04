class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString };
    const excludes = ['page', 'limit', 'sort', 'field'];
    excludes.map((item) => delete queryObject[item]);
    let queryStringIn = JSON.stringify(queryObject);
    queryStringIn = queryStringIn.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStringIn));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortingArr = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortingArr);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  fieldLimiting() {
    if (this.queryString.field) {
      const limitingArr = this.queryString.field.split(',').join(' ');
      this.query = this.query.select(limitingArr);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    let page = this.queryString.page * 1 || 1;
    let limit = this.queryString.limit * 1 || 3;
    let skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
