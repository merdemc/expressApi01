const { CastErrorHandler } = require("./castErrorHandler");
const { DuplicateKeyErrorHandler } = require("./duplicateKeyErrorHandler");
const { HandleExpiredJWT } = require("./jwtError");
const { ValidationErrorHandler, HandleJWTError } = require("./validationErrorHandler");

const DevelopmentErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const ProductionErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    // Generic error response
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

const GlobalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500; // 500 is internal server error
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    DevelopmentErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") {
      error = CastErrorHandler(error);
    }
    // Handling dublicate error
    if (error.code === 11000) {
      error = DuplicateKeyErrorHandler(error);
    }

    if (error.name === "ValidationError") {
      error = ValidationErrorHandler(error);
    }
    if (error.name === "TokenExpiredError") {
      error = HandleExpiredJWT(error);
    }
    if (error.name === "jsonWebTokenError") {
      error = HandleJWTError(error);
    }

    ProductionErrors(res, error);
  }

  next();
};

module.exports = { GlobalErrorHandler };
