const express = require("express");
const MoviesRouter = express.Router();
const {
  GetAllMoviesFunc,
  GetMovieFunc,
  CreateMovieFunc,
  UpdateMovieFunc,
  DeleteMovieFunc,
  SortMoviesFunc,
  SearchMoviesFunc,
  GetPopularMovies,
  GetMovieStats,
  GetMoviesByGenre,
} = require("../controllers/moviesController");
const { IsAuthenticated, CheckRole } = require("../controllers/authController");

// param middleware . value stores id value
//Router.param("id", CheckId);

// Chaining methods and middleware
// middlewares are executed in written order  (middleware1, middleware2, middleware3)
MoviesRouter.route("/").get(IsAuthenticated,GetAllMoviesFunc).post(CreateMovieFunc);
MoviesRouter.route("/sort").get(SortMoviesFunc);
MoviesRouter.route("/search").get(SearchMoviesFunc);
MoviesRouter.route("/popular").get(GetPopularMovies,GetAllMoviesFunc);
MoviesRouter.route("/stats").get(GetMovieStats);
MoviesRouter.route("/movies_by_genre/:genre").get(GetMoviesByGenre);

MoviesRouter.route("/:id")
  .get(IsAuthenticated,GetMovieFunc)
  .patch(IsAuthenticated,UpdateMovieFunc)
  .delete(IsAuthenticated,CheckRole("admin"),DeleteMovieFunc);

module.exports = {MoviesRouter};
