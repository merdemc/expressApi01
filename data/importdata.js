const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("node:fs");
dotenv.config({ path: "../config.env" }); // configuration settings will be written process.env with this code. process.env is available for all files.
const { Movie } = require("../modals/moviesModel");


// Connect mongoDB database
mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    //console.log(conn);
    console.log("mongoDB connection successfull");
  })
  .catch((err) => {
    console.log("mongoDB connection error :", err);
  });

// Read file

async function readFile() {
  const movies = await JSON.parse(
    fs.readFileSync("./moviestomongo.json", "utf8")
  );
  return movies
}

//Delete all documents in collection
const deleteAllMovies = async () => {
  try {
    await Movie.deleteMany();
  } catch (error) {
    console.log(
      "There is an error deleting all movies in database",
      error.message
    );
  }
  process.exit(); // Otherwise process keep running
};

//Import all documents id a file into the database
const importAllMovies = async (documents) => {
  try {
    await Movie.create(documents);
    console.log("Documents have been successfully uploaded");
  
  } catch (error) {
    console.log(
      "There is an error importing all movies in to the database",
      error.message
    );
  }
  process.exit(); // Otherwise process keep running
};

//deleteAllMovies();
//importAllMovies(movies)

// run command like this and check the console log  node importdata.js --import
console.log(process.argv);
//console.log(process.argv0);
// console.log(process.argv[0]);
// console.log(process.argv[1]);
console.log(process.argv[2]);
console.log(process.argv[3]);

// deleting documents with adding options. Run command the following command for this action : node importdata.js --delete
if (process.argv[2] === "--delete") {
  deleteAllMovies();
  console.log("All documents deleted");
}

// Importing/Uploading documents with adding options. Run command the following command for this action : node importdata.js --import
if (process.argv[2] === "--import") {
 readFile()
.then((movies)=>{
importAllMovies(movies);
})

 
}
