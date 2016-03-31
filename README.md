# generator-es6-express
an **opinionated** yeoman generator that scaffolds a mvc webapp powered by express

## what's included
- good old [node](https://nodejs.org/en/)
- server via [express](http://expressjs.com/)
- database via [mongodb](https://www.mongodb.org/) + [mongoose](http://mongoosejs.com/)
- templating via [jade](http://jade-lang.com/)
- [es6](http://es6-features.org) via [babel](https://babeljs.io/)
- linting via [eslint](http://eslint.org/)
- css pre-processing via [libsass](https://github.com/sass/libsass)
- build automation via [gulp](http://gulpjs.com/)
- source control via [git](https://git-scm.com)

## getting started
### install
simply run the following to install via [npm](https://www.npmjs.com/):
```
npm i -g yo gulp-cli bower generator-es6-express
```

### generating!
once installed, simply do `yo es6-express`, and you'll be on your way to building your next project!

### structure
all of your source code goes in the `src` folder.
anything javascript can (and should) be written in es6.
the strucutre is as follows:
```
src
├── app.js              // main express configuration (es6)
├── app
│   ├── controllers     // express routes (es6)
│   ├── models          // mongoose models (es6)
│   └── views           // jade templates (jade)
├── files               // any files that need to be hosted, e.g. pdfs, text files, etc.
├── fonts               // ttf or otf fonts
├── images              // source images
├── scripts             // client-side javascript (es6)
└── styles              // style sheets (sass)
```
running `gulp build` will produce a new directory (`build` by default) with a slightly different structure:
```
build
├── app.js              // transpiled express configuration
├── app
│   ├── controllers     // transpiled express routes
│   ├── models          // transpiled mongoose models
│   └── views           // same files as source
└── static
    ├── css             // actual css
    ├── files           // same files as source
    ├── fonts           // webfonts (eot, svg, ttf, woff, woff2) and a font-face stylesheet
    ├── img             // optimized images
    └── js              // transpiled client-side code
```

### tasks
- `gulp` is the same as `gulp serve`, which not only starts your express server, but also reloads it whenever server-side code changes
- `gulp build` creates your production-ready webapp by running the following tasks:
  - `images` to optimize images
  - `styles` to compile sass, write sourcemaps, autoprefix, and minify
  - `scripts` to
- `gulp lint` will lint all javascript with eslint and rules definted in `.eslint.json`
- `gulp clean` will remove any and all files created by any of the above tasks
- many of the tasks have sub-tasks that allow for finer control, for example:
  - `gulp build:client` will only run the tasks related to the client (`images`, `styles`, `scripts`, `files`, `fonts`, `bower`)
  - `gulp transpile:controllers` will transpile only the controllers
  - `gulp lint:models` will lint only the models
- `gulp tasks` will show you all of the available tasks

## what's missing
#### tests
- while _incredibly_ important, tests are not inlucded in this generator
- it's especially useful to be able to write your own tests, so I'm leaving this as an exercise for the reader 🙃
- if you need help, [this](https://www.terlici.com/2015/09/21/node-express-controller-testing.html) is a decent place to start

## notes
- this is my first yeoman generator, and suggestions are definitely welcome!
