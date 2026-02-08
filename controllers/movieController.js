const Movie = require('../models/movie');
const axios = require('axios');

const createMovie = async (req, res) => {
    try {
        const {title, description, genre, releaseYear, rating, director, poster} = req.body;

        const movie = await Movie.create({
            title,
            description,
            genre,
            releaseYear: releaseYear,
            rating,
            director,
            poster,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find({user: req.user._id}).sort({createdAt: -1});

        res.json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        if (movie.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.json({
            success: true,
            data: movie
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if(!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        if(movie.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const updateMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true, runValidators: true}
        );

        res.json({
            success: true,
            data: updateMovie
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if(!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        if(movie.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await Movie.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Movie deleted'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const searchMovieExternal = async (req, res) => {
    try {
        const { title } = req.params;
        const apiKey = process.env.OMDB_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                message: 'API key not configured'
            });
        }

        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(title)}`);

        if (response.data.Response === 'False') {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        res.json({
            success: true,
            data: {
                title: response.data.Title,
                year: response.data.Year,
                genre: response.data.Genre,
                director: response.data.Director,
                plot: response.data.Plot,
                poster: response.data.Poster,
                rating: response.data.imdbRating
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMovie,
    getMovies,
    getMovieById,
    updateMovie,
    deleteMovie,
    searchMovieExternal
};
    