const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize"); // This will fix no sql query injections
const xss = require("xss-clean"); // Access attack sanitazing data
const hpp = require("hpp"); // http parameter polution

const { MoviesRouter } = require("./routes/movieRouter");
const { CustomError } = require("./helpers/customError");
const { GlobalErrorHandler } = require("./helpers/globalErrorHandler");
const { AuthRouter } = require("./routes/authRouter");
const { UserRouter } = require("./routes/userRouter");

const app = express();
//let PORT = 3000 || process.env.PORT;

app.use(helmet()); // It adds security headers
// rate limiting middleware
let limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour
  message:
    "We have received too many request from this IP. Please try again after 1 hour",
});

console.log("Test express app starting");

const logger = function (req, res, next) {
  console.log("Custom middleware called");
  next();
  
};

app.use("/api", limiter);

//built in middlewares
app.use(express.json({ limit: "10kb" }));

// middlewares for sanitizing request body, query string & query parameter
app.use(sanitize()); // This middleware shall be after reading request.
app.use(xss()); // It will clean any user input from malicous html code

app.use(
  hpp({
    whitelist: [
      "duration",
      "ratings",
      "releaseYear",
      "releaseDate",
      "genre",
      "director",
      "price",
      "actors",
    ],
  })
); // it prevents http parameter polution

app.use(express.static("./public"));
//3rd party middleware

if (process.env.NODE_ENV === "development") {
  app.use(morgan("combined")); // HTTP logger
}

// custom middlewares
app.use(logger);
// this middleware adds request time to the request object.
app.use((req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
});

// ROUTES
app.use("/api/v1/movies", MoviesRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/user", UserRouter);
// Default route shall be at last place in routes
app.all("*", (req, res, next) => {
  //res.status(200).send("welcome to express app"); // test response
  //res.status(200).send("<h1>welcome to express app</h1> "); // html response

  /*   res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on the server`,
  });
 */

  /*   const err = new Error(
    `Can't find ${req.originalUrl} on the server`
  );
  err.status = "fail";
  err.statusCode = 404;

 */

  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server`,
    404
  );

  // If we pass error in next(err) function, express will assume an error has occured. It will skip all all middleware and call the error handling functions.
  next(err);
});

// Global Error Handling Middleware have 4 arguments. First one is error
app.use(
  GlobalErrorHandler
  /*   (error, req, res, next) => {
  next();
  error.statusCode = error.statusCode || 500; // 500 is internal server error
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
} */
);

// app.listen(PORT, () => {
//   console.log(`Test express app started and working on port ${PORT}`);
// });

console.log(process.env);

module.exports = { app };
