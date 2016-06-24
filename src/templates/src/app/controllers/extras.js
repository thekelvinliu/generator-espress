'use strict';

import path from 'path';
import { Router } from 'express';

// create router and set routes
const router = Router();
router.get('/', (req, res, next) => res.render('extras', {
  message: 'welcome to extras!',
  base: true
}));
router.get('/:message', (req, res, next) =>
  (!req.params.hasOwnProperty('message'))
    ? res.status(404).end()
    : res.render('extras', {
      message: `welcome to extras!
        you are currently at ${path.join('extras', req.params.message)}`,
      base: false
    })
);

// export router
export default router;
