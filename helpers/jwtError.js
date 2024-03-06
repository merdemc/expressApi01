const { CustomError } = require("./customError");

const HandleExpiredJWT = (err) => {
   return new CustomError("JWT token expried. Please login again!", 401);
};

const HandleJWTError = (err) => {
    return new CustomError("Invalid JWT token. Please login again!", 401);
 };
 

module.exports = { HandleExpiredJWT,HandleJWTError };