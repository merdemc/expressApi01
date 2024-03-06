class Apifeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  Filter() {
    let queryStr = JSON.stringify(this.queryStr);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);

    return this;
  }

  Sort() {
    if (this.queryStr.sort) {
      const sortBy = req.queryStr.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      //queryMovies = await Movie.find().sort("createdAt");
      this.query = this.query.sort("createdAt");
    }
    return this;
  }

  LimitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  Paginate() {
    const page = this.queryStr.page * 1 || 1; // req.query.page*1 it makes number, || 1 if there is no value default is 1
    const limit = this.queryStr.limit * 1 || 20;
    //PAGE 1: 1-10; PAGE 2:11-20; PAGE 3:21-30
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const moviesCount = await Movie.countDocuments();
    //   if (skip >= moviesCount) {
    //     throw new Error("This page is not found!");
    //   }
    // }

    return this;
  }
}

module.exports = { Apifeatures };
