const jwt = require("jsonwebtoken");

const GetToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_JWT, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

module.exports = { GetToken };
