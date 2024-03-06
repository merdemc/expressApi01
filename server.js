const mongoose = require("mongoose");
const dotenv = require("dotenv"); // this line shall be before app since app use env variable. Otherwise app cannot use env variables
dotenv.config({ path: "./config.env" }); // configuration settings will be written process.env with this code. process.env is available for all files.

// Handling Uncaugt Exceptions
// This handler should be on the top and before app to catch errors
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception occured! Shutting down ...");
  process.exit(1);
});

const { app } = require("./app");

let PORT = process.env.PORT || 3100;

//console.log(process.env);// express environment variable
//console.log(app.get("env")); // NodeJS environment variable

mongoose
  /*   .connect(process.env.MONGO_URL)
  .then((conn) => {
    //console.log(conn);
    console.log("mongoDB connection successfull");
  })
  .catch((err) => {
    console.log("mongoDB connection error :", err);
  }); */

  .connect(process.env.MONGO_URL)
  .then((conn) => {
    //console.log(conn);
    console.log("mongoDB connection successfull");
  });

const server = app.listen(PORT, () => {
  console.log(`Test express app started and working on port ${PORT}`);
});

// Handling Rejected Promises Globally. listen all un handledRejections. This errors are not related with express
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down ...");

  server.close(() => {
    process.exit(1);
  });
});

