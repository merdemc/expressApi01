// Inherits properties from Error class. It is the same as new Error()
// We need to pass message and statusCode values whenever we call/instantiate this custom class
// const error = new CustomError("error message",404)
// with super() we are calling Error class.
// status code 400-499 -- > Client errors
// status code 500-599 -- > Internal Server errors

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    this.isOperational = true; // We are going to use this CustomError class only for operational errors. So that is why we set it as true.
    Error.captureStackTrace(this, this.constructor); // Base Error class includes stack error captures. It tells us where the error actually happemd in the code.
  }
}

module.exports ={CustomError};