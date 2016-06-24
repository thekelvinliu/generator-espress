'use strict';

// this file simply imports/requires all other models in the directory
import './movie';

// alternatively, if there are a lot of models to require, do the following:
// import path from 'path';
// import glob from 'glob'; // this is NOT in package.json by default
// glob.sync(path.join(__dirname, '!(index).js')).forEach(model => {
//   require(model);
// });
