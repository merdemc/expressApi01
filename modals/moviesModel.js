const mongoose = require("mongoose");
const fs = require("node:fs");
const validator = require("validator");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      unique: true,
      maxLength: [
        100,
        "Movie title/name must not have more than 100 characters",
      ],
      minLength: [4, "Movie title/name must have at least 4 characters"],
      trim: true, // Remove if there is space before and after the name
      validate: {
        validator: function (value) {
          if (value === "ERDEM") {
            //return ";
            return false;
          }
          return true;
        },
        message: `title name cannot be {VALUE}`,
      },
      validate: [validator.isAlpha, "title contain only alphabet"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
    runtime: {
      type: String,
      required: [true, "runtime is required"],
    },
    ratings: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 3 && value <= 8; // If we use this keyword like this.value > 10 it will work onşy during cretaing documents. Not work during update etc.
        },
        message: `rating ({VALUE}) should be between 4 and 7`,
      },
      min: [1, "Ratings must be 1.0 or above."],
      max: [10, "Ratings must be 10 or below"],
    },

    totalRatings: {
      type: Number,
    },
    releaseYear: {
      type: String,
      required: [true, "Release year is required"],
    },
    releaseDate: {
      type: String,
    },

    genre: {
      type: [String],
      required: [true, "Genre is required"],
      //   enum: {
      //     values: [
      //       "Action",
      //       "Advanture",
      //       "Sci-Fi",
      //       "Thriller",
      //       "Crime",
      //       "Drama",
      //       "Comedy",
      //       "Romance",
      //       "Biography",
      //     ],
      //     message:
      //       "You can chose only these names : Action, Advanture, Sci-Fi, Thriller, Crime, Drama, Comedy, Romance, Biography",
      //   },
    },
    director: {
      type: [String],
      required: [true, "Director is required"],
    },
    actors: {
      type: [String],
      required: [true, "Actors are required"],
    },
    images: {
      type: [String],
      required: [true, "Cover İmage link is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // it exclude sending this data. Normally password etc will not send
    },
    createdBy: {
      type: String,
      default: "Mehmet Erdem Çukadar",
      select: true, // it exclude sending this data. Normally password etc will not send
    },
  },
  {
    // We cannot use virtual data in quering data. Since they are technically not part of a database
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose middleware or hooks. pre hook, post hook
// "save" event happens only .save  and .create actions. Not insertmany, findByIdAndUpdate etc.
movieSchema.pre("save", function (next) {
  this.createdBy = " Erdem Çukadar";
  next();
});

// This keyword represent query onject in save trigger
movieSchema.post("save", function (doc, next) {
  let content = `A new document with name ${doc.title} has been created by ${doc.createdBy} at time ${doc.createdAt}\n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
    fs.writeFileSync(
      "./log/logerror.txt",
      `${err.message}`,
      { flag: "a" },
      (err) => {
        console.log(
          "There is an error writing error log in mongoose post hook. error: ",
          err.message
        );
      }
    );
  });
  next();
});

// This keyword represent query onject in find trigger
// We can use regular expression to run functin taht trigger starts with f"ind"
movieSchema.pre(/^find/, function (next) {
  //this.find({releaseDate:{$gte:Date.now()}});
  this.find({ price: { $lte: 70 } });
  this.startTime = Date.now();
  next();
});

movieSchema.post(/^find/, function (docs, next) {
  //this.find({releaseDate:{$gte:Date.now()}});
  this.find({ price: { $lte: 70 } });
  this.endTime = Date.now();

  let content = `Query took ${
    this.endTime - this.startTime
  } millisecond to fetch the document\n`;
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err.message);
  });

  next();
});

// movieSchema.pre("findOne",function (next) {
//   //this.find({releaseDate:{$gte:Date.now()}});
//   this.find({price:{$lte:70}});
//   next();
// });

// movieSchema.pre("find",function (next) {
//   //this.find({releaseDate:{$gte:Date.now()}});
//   this.find({price:{$lte:70}});
//   next();
// });

movieSchema.virtual("durationInHours").get(function () {
  return this.runtime / 60;
});

movieSchema.pre("aggregate", function (next) {
  console.log(this.pipeline().unshift({ $match: { price: { $lte: 50 } } }));

  next();
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = { Movie };
