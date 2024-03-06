const { CustomError } = require("./customError");

const DuplicateKeyErrorHandler = (err) => {
  const msg = `There is already a document with title ${err.keyValue.title}. Please use another name.`;
  return new CustomError(msg, 400);
};

module.exports = { DuplicateKeyErrorHandler };
