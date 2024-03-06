const { CustomError } = require("./customError");

const CastErrorHandler =(err)=>{
    const msg=`Invalid value for ${err.path} : ${err.value}`;
   return new CustomError(msg,400);
}


module.exports= {CastErrorHandler}