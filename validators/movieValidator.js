const Joi = require('joi');

const movieSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(10).required(),
  genre: Joi.string().required(),
  releaseYear: Joi.number().integer().min(1900).max(2030).required(),
  rating: Joi.number().min(0).max(10),
  director: Joi.string(),
  poster: Joi.string().uri()
});

const updateMovieSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().min(10),
  genre: Joi.string(),
  releaseYear: Joi.number().integer().min(1900).max(2030),
  rating: Joi.number().min(0).max(10),
  director: Joi.string(),
  poster: Joi.string().uri()
});

module.exports = {
  movieSchema,
  updateMovieSchema
};