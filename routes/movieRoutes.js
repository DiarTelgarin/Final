const express = require('express');
const router = express.Router();
const {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    searchMovieExternal
} = require('../controllers/movieController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { movieSchema, updateMovieSchema } = require('../validators/movieValidator');

router.route('/')
    .post(protect, validate(movieSchema), createMovie)
    .get(protect, getMovies);

router.get('/search/:title', protect, searchMovieExternal);

router.route('/:id')
    .get(protect, getMovieById)
    .put(protect, validate(updateMovieSchema), updateMovie)
    .delete(protect, deleteMovie);

module.exports = router;