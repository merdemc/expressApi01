# expressApi01
my API app with express and mongoDB

//Notes-------------------------------------------------------------------------------------------------------------------------------------------------

// Middleware -------------------------------------------------------------------------------------------------------------------------------------------
express generally uses middleware instead of functions. Validation, Error vs


//To set environment variable----------------------------------------------------------------------------------------------------------------------------

SET USERNAME=erdem
SET NODE_ENV=development

// Look et express environment variable
console.log(process.env);// express environment variable

// look at node environment variable
console.log(app.get("env"));

// Configuraion files
// Setting so many env varibale is not practical. We are using configuration file instead.
// UPPERCASE is conventions, .env extention is convention

// dotenv library
npm intsall dotenv

// this line shall be before app since app use env variable. Otherwise app cannot use env variables
const dotenv =  require('dotenv'); 

// configuration settings will be written in process.env with this code. process.env is available for all files.
dotenv.config({path:"./config.env"}); 

//Mongoose Validators------------------------------------------------------------

https://mongoosejs.com/docs/validation.html

It si defined in Schema

unique : it is not a vidator
maxLength and minLength can be used for String types.
min and max validators can be used for Number and Date types



enum:["Action","Advanture", "Sci-Fi", "Thriller","Crime","Drama","Comedy","Romance","Biography"]  user can coohoe specified values
//------------------------------------------------------------------------------------------------------------------------------

// --------------DEBUGGING NODE JS JS Code----------------------------------------------------------------------------------------------------------------------------
There are tools ndb
We use here VSCode builtin tool to debug

--> Go to Run and Debug
--> Create a launch json.file with selecting Node js
-- > mark the code where you want to check. And than strat debuging and initiate a query


//------------------------- jwt sending from client----------------------------------------------------------------------------

Add and Autorization header with value bearer abcd
Key: Autorization Value: bearer tokenValue(eysdddd..)

using "bearer" before token is an convention


//------------------------------------------------