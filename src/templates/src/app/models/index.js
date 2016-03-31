'use strict';
// this file simply requires all other models in the directory
// if there are a lot, the following will work:
// import path from 'path';
// import glob from 'glob';
// glob.sync(path.join(__dirname, '!(index).js')).forEach(model => {
//   require(model);
// });

require('./movie');
