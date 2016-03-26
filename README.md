# generator-es6-express
an opinionated yeoman generator that scaffolds a mvc webapp powered by express

## what's included
- good old [node](https://nodejs.org/en/)
- server via [express](http://expressjs.com/)
- database via [mongodb](https://www.mongodb.org/)
- templating via [jade](http://jade-lang.com/)
- build/task automation via [gulp](http://gulpjs.com/)
- es6 via [babel](https://babeljs.io/) + linting via [eslint](http://eslint.org/)

## install
before installing, please ensure you have [yeoman](http://yeoman.io/), [gulp](http://gulpjs.com/), and [bower](http://bower.io/).
if not, `npm i -g yo gulp-cli bower` should do the trick.
just run the following to install via [npm](https://www.npmjs.com/):
```bash
npm i -g yo gulp-cli bower generator-es6-express
cd /some/parent/directory
yo es6-express
```
or, you can install directly from this repo:
```bash
git clone https://github.com/thekelvinliu/generator-es6-express
cd generator-es6-express
npm i -g yo gulp-cli bower
npm install
npm link
gulp
```

## options
- `--no-bower`: scaffolds without [bower](http://bower.io/).

## what's missing
#### tests!
- while _incredibly_ important, tests are not inlucded in this generator
- it's especially useful to be able to write your own tests, so I'm leaving this as an exercise for the reader 🙃
- if you need help starting, [this](https://www.terlici.com/2015/09/21/node-express-controller-testing.html) is a decent place to start.
- _n.b._: [gulp](http://gulpjs.com/) has plugins for many popular test frameworks,
e.g. [mocha](https://mochajs.org/), [jasmine](http://jasmine.github.io/), and [karma](https://karma-runner.github.io/).

## notes
- `gulp tasks` will show you all the available tasks
- `gulp clean` is your friend
- definitely take advantage of gulp; peek around the gulpfile, and make it your own
- this is my first yeoman generator, so suggestions are welcome!
