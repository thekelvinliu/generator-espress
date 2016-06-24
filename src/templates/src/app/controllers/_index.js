'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import { Router } from 'express';
import mongoose from 'mongoose';
import extrasController from './extras';

// load models
const Movie = mongoose.model('Movie');

// create router
const router = Router();
// load other controllers
router.use('/extras', extrasController);

// set basic routes
router.get('/', (req, res, next) => res.render('index', {
  title: '<%= projectName %>'
}));
// note that `movies` will likely be empty because the local mongodb is empty.
// you can populate it with example data by downloading it here:
// https://gist.githubusercontent.com/thekelvinliu/152f2c488430be9b6649c963d5a2afea/raw/22d73b73fb653c091d4a5ffe470299d64a0d0fb7/movies
// then navigate to the directory containing the file and run the following:
// $ mongoimport --db test --collection movies movies
router.get('/movies', (req, res, next) =>
  Movie
    .find()
    .exec((err, movies) => (err) ? next(err) : res.render('movies', {
      title: 'Movies!',
      movies
    }))
);

// export router
export default router;
