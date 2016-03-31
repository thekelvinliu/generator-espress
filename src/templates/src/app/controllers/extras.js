'use strict';

import path from 'path';
import express from 'express';

// create router and set routes
const router = express.Router();
router.get('/', (req, res, next) => {
  res.render('extras', {
    message: 'welcome to extras!',
    base: true
  });
});
router.get('/:message', (req, res, next) => {
  if (req.params.hasOwnProperty('message')) {
    res.render('extras', {
      message: `welcome to extras!
        you currently are at ${path.join('extras', req.params.message)}`,
      base: false
    });
  } else {
    res.status(404);
  }
});

// export router
module.exports = router;
