'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import express from 'express';
import mongoose from 'mongoose';

// load models
const Movie = mongoose.model('Movie');

// create router
const router = express.Router();
// load other controllers
router.use('/extras', require('./extras'));

// set basic routes
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '<%= projectName %>'
  });
});
router.get('/movies', (req, res, next) => {
  Movie.find((err, movies) => {
    if (err) return next(err);
    res.render('movies', {
      title: 'Movies!',
      movies
    });
  });
});

// export router
module.exports = router;
