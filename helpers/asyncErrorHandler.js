// High oreder function to getrid of repeated try catch methode and similar error handlings
const AsyncErrorHandler = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err));
  };
};

module.exports = { AsyncErrorHandler };
