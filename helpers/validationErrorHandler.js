const { CustomError } = require("./customError");

const ValidationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((value) => value.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data : ${errorMessages}.`;

  return new CustomError(msg, 400);
};

module.exports = { ValidationErrorHandler };
