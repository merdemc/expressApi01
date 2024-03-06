const { Movie } = require("../modals/moviesModel");
const { Apifeatures } = require("../helpers/helpers");
const { AsyncErrorHandler } = require("../helpers/asyncErrorHandler");
const { CustomError } = require("../helpers/customError");

// Middlewares
const GetPopularMovies = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratings";

  next();
};

// API Endpoint Functions - Start --------------------------------------------------

const SortMoviesFunc = async (req, res) => {
  try {
    // const movies = await Movie.find(queryObj);
    //  let queryMovies = Movie.find();

    // let queryMovies;

    let queryMovies = Movie.find();

    //  console.log("queryMovies", queryMovies);
    // console.log("req.query.sort", req.query);
    //  console.log("req.query.sort", req.query.sort);

    // Query string  ../movies/?duration=90&ratings=4.5&sort=1&page=12
    //const movies = await Movie.find({"duration": req.query.duration,"ratings": req.query.ratings});
    //const movies = await Movie.find(req.query); // This will not work if we provide  parameter which is not valid in database
    // const movies = await Movie.find()
    //   .where("duration")
    //   .equals(req.query.duration)
    //   .where("ratings")
    //   .equals(req.query.ratings);

    // Sorting logic
    // accending order: query string  ../movies/?sort=price,ratings
    // decending order: query string  ../movies/?sort=-price,-ratings
    // decending order: "-" use minus sign before sorting parameter
    // query decending order "-createdAt", query accending order "createdAt"

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      //queryMovies=queryMovies.sort("ratings totalRatings")
      //queryMovies = await Movie.find().sort(sortBy);
      queryMovies = queryMovies.sort(sortBy);

      console.log("sortBy", sortBy);
    } else {
      console.log("sortBy createdAt");
      //queryMovies = await Movie.find().sort("createdAt");
      queryMovies = queryMovies.sort("createdAt");
    }

    const movies = await queryMovies;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      count: movies.length,
      data: {
        movies: movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  }
};

const SearchMoviesFunc = async (req, res) => {
  try {
    let querytStr = JSON.stringify(req.query);
    querytStr = querytStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(querytStr);
    console.log("query object", queryObj);

    // const queryMovies = await Movie.find(req.query);
    let queriedMovies = Movie.find(queryObj);
    // find({name:"erdem",age:{$gte:25},price:{$lte:125}})

    // let queryMovies = await Movie.find(queryObj);
    // Query string  ../movies/?duration=90&ratings=4.5&sort=1&page=12
    // const movies = await Movie.find({"duration": req.query.duration,"ratings": req.query.ratings});
    // const movies = await Movie.find(req.query); // This will not work if we provide  parameter which is not valid in database
    // const movies = await Movie.find()
    //   .where("duration")
    //   .equals(req.query.duration)
    //   .where("ratings")
    //   .equals(req.query.ratings);

    let movies = await queriedMovies;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      count: movies.length,
      data: {
        movies: movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  }
};

const GetAllMoviesFunc = AsyncErrorHandler(async (req, res, next) => {
  const features = new Apifeatures(Movie.find(), req.query)
    .Filter()
    .Sort()
    .LimitFields()
    .Paginate();

  let movies = await features.query;

  // let queriedMovies = Movie.find();

  // // SORTING
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   //queryMovies=queryMovies.sort("ratings totalRatings")
  //   //queryMovies = await Movie.find().sort(sortBy);
  //   queriedMovies = queriedMovies.sort(sortBy);
  // } else {
  //   //queryMovies = await Movie.find().sort("createdAt");
  //   queriedMovies = queriedMovies.sort("createdAt");
  // }
  // // END -- SORTING LOGIC

  // // LIMITING FIELDS
  // if (req.query.fields) {
  //   //query.select("name duration price ratings")   // localhost:3000/api/v1/movies/?fields=price,ratings
  //   // use "-" before the fields to exclude it  // localhost:3000/api/v1/movies/?fields=-price,-ratings
  //   const fields = req.query.fields.split(",").join(" ");
  //   queriedMovies = queriedMovies.select(fields);
  // } else {
  //   queriedMovies = queriedMovies.select("-__v");
  // }

  // // PAGINATION
  // // localhost:3000/api/v1/movies/?page=2&limit=5
  // const page = req.query.page * 1 || 1; // req.query.page*1 it makes number, || 1 if there is no value default is 1
  // const limit = req.query.limit * 1 || 20;
  // //PAGE 1: 1-10; PAGE 2:11-20; PAGE 3:21-30
  // const skip = (page - 1) * limit;
  // queriedMovies = queriedMovies.skip(skip).limit(limit);

  // if (req.query.page) {
  //   const moviesCount = await Movie.countDocuments();
  //   if (skip >= moviesCount) {
  //     throw new Error("This page is not found!");
  //   }
  // }

  // const movies = await queriedMovies;

  res.status(200).json({
    status: "success",
    requestedAt: req.requestedAt,
    count: movies.length,
    data: {
      movies: movies,
    },
  });

  // try {
  //   const features = new Apifeatures(Movie.find(), req.query)
  //     .Filter()
  //     .Sort()
  //     .LimitFields()
  //     .Paginate();
  //   let movies = await features.query;

  //   // let queriedMovies = Movie.find();

  //   // // SORTING
  //   // if (req.query.sort) {
  //   //   const sortBy = req.query.sort.split(",").join(" ");
  //   //   //queryMovies=queryMovies.sort("ratings totalRatings")
  //   //   //queryMovies = await Movie.find().sort(sortBy);
  //   //   queriedMovies = queriedMovies.sort(sortBy);
  //   // } else {
  //   //   //queryMovies = await Movie.find().sort("createdAt");
  //   //   queriedMovies = queriedMovies.sort("createdAt");
  //   // }
  //   // // END -- SORTING LOGIC

  //   // // LIMITING FIELDS
  //   // if (req.query.fields) {
  //   //   //query.select("name duration price ratings")   // localhost:3000/api/v1/movies/?fields=price,ratings
  //   //   // use "-" before the fields to exclude it  // localhost:3000/api/v1/movies/?fields=-price,-ratings
  //   //   const fields = req.query.fields.split(",").join(" ");
  //   //   queriedMovies = queriedMovies.select(fields);
  //   // } else {
  //   //   queriedMovies = queriedMovies.select("-__v");
  //   // }

  //   // // PAGINATION
  //   // // localhost:3000/api/v1/movies/?page=2&limit=5
  //   // const page = req.query.page * 1 || 1; // req.query.page*1 it makes number, || 1 if there is no value default is 1
  //   // const limit = req.query.limit * 1 || 20;
  //   // //PAGE 1: 1-10; PAGE 2:11-20; PAGE 3:21-30
  //   // const skip = (page - 1) * limit;
  //   // queriedMovies = queriedMovies.skip(skip).limit(limit);

  //   // if (req.query.page) {
  //   //   const moviesCount = await Movie.countDocuments();
  //   //   if (skip >= moviesCount) {
  //   //     throw new Error("This page is not found!");
  //   //   }
  //   // }

  //   // const movies = await queriedMovies;

  //   res.status(200).json({
  //     status: "success",
  //     requestedAt: req.requestedAt,
  //     count: movies.length,
  //     data: {
  //       movies: movies,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

/* 
const GetAllMoviesFunc = async (req, res) => {
  try {

    let queriedMovies = Movie.find();

    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      //queryMovies=queryMovies.sort("ratings totalRatings")
      //queryMovies = await Movie.find().sort(sortBy);
      queriedMovies = queriedMovies.sort(sortBy);
    } else {
      //queryMovies = await Movie.find().sort("createdAt");
      queriedMovies = queriedMovies.sort("createdAt");
    }
    // END -- SORTING LOGIC

    // LIMITING FIELDS
    if (req.query.fields) {
      //query.select("name duration price ratings")   // localhost:3000/api/v1/movies/?fields=price,ratings
      // use "-" before the fields to exclude it  // localhost:3000/api/v1/movies/?fields=-price,-ratings
      const fields = req.query.fields.split(",").join(" ");
      queriedMovies = queriedMovies.select(fields);
    } else {
      queriedMovies = queriedMovies.select("-__v");
    }

    // PAGINATION
    // localhost:3000/api/v1/movies/?page=2&limit=5
    const page = req.query.page * 1 || 1; // req.query.page*1 it makes number, || 1 if there is no value default is 1
    const limit = req.query.limit * 1 || 20;
    //PAGE 1: 1-10; PAGE 2:11-20; PAGE 3:21-30
    const skip = (page - 1) * limit;
    queriedMovies = queriedMovies.skip(skip).limit(limit);

    if (req.query.page) {
      const moviesCount = await Movie.countDocuments();
      if (skip >= moviesCount) {
        throw new Error("This page is not found!");
      }
    }

    const movies = await queriedMovies;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestedAt,
      count: movies.length,
      data: {
        movies: movies,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  }
};
 */

const GetMovieFunc = AsyncErrorHandler(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    const error = new CustomError(
      `Couldn't find a document with _id:${req.params.id}`,
      404
    );
    return next(error);
  }

  res.status(200).json({
    status: "success",
    data: {
      movie: movie,
    },
  });

  // try {
  //   //let movie = await Movie.find({ _id: req.params.id });
  //   let movie = await Movie.findById(req.params.id);

  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       movie: movie,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

const CreateMovieFunc = AsyncErrorHandler(async (req, res, next) => {
  const movie = await Movie.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      movies: movie,
    },
  });

  /*   try {
    const movie = await Movie.create(req.body);
    res.status(200).json({
      status: "success",
      data: {
        movies: movie,
      },
    });
   
  } catch (error) {
    res.status(404).json({
      status: "failure",
      message: error.message,
    });
  } */
});

const UpdateMovieFunc = AsyncErrorHandler(async (req, res, next) => {
  //We set new as true to get updated document
  //Schema validates document in initial create/save but not update. We need to set runValidator as true to validate it.
  const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedMovie) {
    const error = new CustomError(
      `Couldn't find a document with _id:${req.params.id}`,
      404
    );
    return next(error);
  }
  res.status(200).json({
    status: "success",
    data: {
      movies: updatedMovie,
    },
  });

  // try {
  //   //We set new as true to get updated document
  //   //Schema validates document in initial create/save but not update. We need to set runValidator as true to validate it.
  //   const updatedMovie = await Movie.findByIdAndUpdate(
  //     req.params.id,
  //     req.body,
  //     { new: true, runValidators: true }
  //   );

  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       movies: updatedMovie,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

const DeleteMovieFunc = AsyncErrorHandler(async (req, res, next) => {
  //We set new as true to get updated document
  //Schema validates document in initial create/save but not update. We need to set runValidator as true to validate it.
  const deletedMovie = await Movie.findByIdAndDelete(req.params.id);


  if (!deletedMovie) {
    const error = new CustomError(
      `Couldn't find a document with _id:${req.params.id}`,
      404
    );
    return next(error);
  }

/*   if (deletedMovie === null) {
    res.status(404).json({
      status: "failure",
      message: `couldn't find a document with id = ${req.params.id}`,
    });
    return;
  } */

  res.status(200).json({
    status: "success",
    data: {
      movies: deletedMovie,
    },
  });

  // try {
  //   //We set new as true to get updated document
  //   //Schema validates document in initial create/save but not update. We need to set runValidator as true to validate it.
  //   const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

  //   if (deletedMovie === null) {
  //     res.status(404).json({
  //       status: "failure",
  //       message: `couldn't find a document with id = ${req.params.id}`,
  //     });
  //     return;
  //   }

  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       movies: deletedMovie,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

const GetMovieStats = AsyncErrorHandler(async (req, res, next) => {
  // Second item inputs are first item result. Third item (if there is) input is seconf item result etc.
  // _id:null, grouping will be based on _id value such as "$releaseYear" etc.
  // $sum:1 means add 1 in eack item.
  const stats = await Movie.aggregate([
    { $match: { ratings: { $gte: 3 } } },
    {
      $group: {
        _id: "$releaseYear",
        avgRating: { $avg: "$ratings" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalPrice: { $sum: "$price" },
        movieCount: { $sum: 1 },
      },
    },
    { $sort: { minPrice: 1 } }, // sorts ascending or. -1 means sorting decending order
    { $match: { maxPrice: { $lte: 50 } } },
  ]);

  res.status(200).json({
    status: "success",
    count: stats.length,
    data: {
      stats: stats,
    },
  });

  // try {
  //   // Second item inputs are first item result. Third item (if there is) input is seconf item result etc.
  //   // _id:null, grouping will be based on _id value such as "$releaseYear" etc.
  //   // $sum:1 means add 1 in eack item.
  //   const stats = await Movie.aggregate([
  //     { $match: { ratings: { $gte: 3 } } },
  //     {
  //       $group: {
  //         _id: "$releaseYear",
  //         avgRating: { $avg: "$ratings" },
  //         avgPrice: { $avg: "$price" },
  //         minPrice: { $min: "$price" },
  //         maxPrice: { $max: "$price" },
  //         totalPrice: { $sum: "$price" },
  //         movieCount: { $sum: 1 },
  //       },
  //     },
  //     { $sort: { minPrice: 1 } }, // sorts ascending or. -1 means sorting decending order
  //     { $match: { maxPrice: { $lte: 50 } } },
  //   ]);

  //   res.status(200).json({
  //     status: "success",
  //     count: stats.length,
  //     data: {
  //       stats: stats,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

const GetMoviesByGenre = AsyncErrorHandler(async (req, res, next) => {
  // Second item inputs are first item result. Third item (if there is) input is seconf item result etc.
  // _id:null, grouping will be based on _id value such as "$releaseYear" etc.
  // $sum:1 means add 1 in eack item.
  const genre = req.params.genre;

  const movies = await Movie.aggregate([
    { $unwind: "$genre" },
    {
      $group: {
        _id: "$genre",
        movieCount: { $sum: 1 },
        movies: { $push: "$title" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } }, // Specify reqyested values in result. Value "1" will be included. Value "0" will not be included.
    { $sort: { movieCount: -1 } }, // sorts ascending or. -1 means sorting decending order
    //{ $limit: 6 }, // limits number of documents in result
    { $match: { genre: genre } },
  ]);

  res.status(200).json({
    status: "success",
    count: movies.length,
    data: {
      movies: movies,
    },
  });

  // try {
  //   // Second item inputs are first item result. Third item (if there is) input is seconf item result etc.
  //   // _id:null, grouping will be based on _id value such as "$releaseYear" etc.
  //   // $sum:1 means add 1 in eack item.
  //   const genre = req.params.genre;

  //   const movies = await Movie.aggregate([
  //     { $unwind: "$genre" },
  //     {
  //       $group: {
  //         _id: "$genre",
  //         movieCount: { $sum: 1 },
  //         movies: { $push: "$title" },
  //       },
  //     },
  //     { $addFields: { genre: "$_id" } },
  //     { $project: { _id: 0 } }, // Specify reqyested values in result. Value "1" will be included. Value "0" will not be included.
  //     { $sort: { movieCount: -1 } }, // sorts ascending or. -1 means sorting decending order
  //     //{ $limit: 6 }, // limits number of documents in result
  //     { $match: { genre: genre } },
  //   ]);

  //   res.status(200).json({
  //     status: "success",
  //     count: movies.length,
  //     data: {
  //       movies: movies,
  //     },
  //   });
  // } catch (error) {
  //   res.status(404).json({
  //     status: "failure",
  //     message: error.message,
  //   });
  // }
});

module.exports = {
  GetAllMoviesFunc,
  GetMovieFunc,
  CreateMovieFunc,
  UpdateMovieFunc,
  DeleteMovieFunc,
  SortMoviesFunc,
  SearchMoviesFunc,
  GetPopularMovies,
  GetMovieStats,
  GetMoviesByGenre,
};
