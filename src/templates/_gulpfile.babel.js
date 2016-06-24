'use strict';

import fs from 'fs';
import path from 'path';
import del from 'del';
import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
import mkdirp from 'mkdirp';
import vfs from 'vinyl-fs';
const $ = plugins({
  pattern: ['gulp-*', 'main-bower-files']
});

// base directories, paths, etc.
const SRC = 'src';
const DEST = '<%= buildDir %>';
const PATHS = {
  // client
  styles: {
    src: path.join(SRC, 'styles/**/*.scss'),
    dest: path.join(DEST, 'static/css')
  },
  images: {
    src: path.join(SRC, 'images/**/*'),
    dest: path.join(DEST, 'static/img')
  },
  scripts: {
    src: path.join(SRC, 'scripts/**/*.js'),
    dest: path.join(DEST, 'static/js')
  },
  files: {
    src: path.join(SRC, 'files/**/*'),
    dest: path.join(DEST, 'static/files')
  },
  fonts: {
    src: path.join(SRC, 'fonts/**/*.ttf'),
    dest: path.join(DEST, 'static/fonts')
  },
  // server
  app: {
    src: path.join(SRC, 'app.js'),
    dest: DEST
  },
  config: {
    src: path.join(SRC, 'config.js'),
    dest: DEST
  },
  models: {
    src: path.join(SRC, 'app/models/**/*.js'),
    dest: path.join(DEST, 'app/models')
  },
  views: {
    src: path.join(SRC, 'app/views/**/*.jade'),
    dest: path.join(DEST, 'app/views')
  },
  controllers: {
    src: path.join(SRC, 'app/controllers/**/*.js'),
    dest: path.join(DEST, 'app/controllers')
  },
  helpers: {
    src: path.join(SRC, 'app/helpers/**/*.js'),
    dest: path.join(DEST, 'app/helpers')
  }
};

// commonly used sets pertaining to tasks
// set of all keys of PATHS
const ALL = new Set(Object.keys(PATHS));
// client-related set
const CLIENT = new Set(['styles', 'images', 'scripts', 'files', 'fonts']);
// server-related set, i.e. ALL - CLIENT
const SERVER = new Set([...ALL].filter(el => !CLIENT.has(el)));
// set of things that need to be transpiled, i.e. SERVER - {'views'}
const TRANSPILE = new Set([...SERVER].filter(el => el !== 'views'));
// set of things that need to be linted, i.e. TRANSPILE ∪ {'scripts'}
const LINT = new Set([...TRANSPILE, 'scripts']);

// default task is the same as serve
gulp.task('default', ['serve']);
// start express server and reload when server-side files change
gulp.task('serve', ['watch'], () =>
  $.nodemon({
    script: path.join(DEST, 'app.js'),
    watch: path.join(DEST, '**/*.js'),
    ignore: path.join(DEST, 'static')
  })
);

// watch all source files for changes
gulp.task('watch', ['build'], () => {
  for (const task of ALL) {
    // tanspile tasks
    if (TRANSPILE.has(task)) gulp.watch(PATHS[task].src, [`transpile:${task}`]);
    // add some delay for images
    else if (task === 'images') {
      gulp.watch(PATHS.images.src, {
        debounceDelay: 2500
      }, ['images']);
    } else gulp.watch(PATHS[task].src, [task]);
  }
  // also lint this gulpfile on save
  gulp.watch('gulpfile.babel.js', ['lint:gulpfile']);
});

// build everything
gulp.task('build', ['build:client', 'build:server']);
// build client-side files
gulp.task('build:client', [...CLIENT].concat('bower'));
// build server-side files
gulp.task('build:server', ['transpile', 'views', 'ln']);

// optimize images
gulp.task('images', () =>
  gulp.src(PATHS.images.src)
    .pipe($.changed(PATHS.images.dest))
    .pipe($.imagemin())
    .pipe(gulp.dest(PATHS.images.dest))
    .pipe($.print(fp => `image: ${fp}`))
);

// compile sass, sourcemaps, autoprefix, minify
gulp.task('styles', () =>
  gulp.src(PATHS.styles.src)
    .pipe($.changed(PATHS.styles.dest, {
      extension: '.css'
    }))
    .pipe($.plumber({
      errorHandler: function(err) {
        $.util.log(err);
        this.emit('end');
      }
    }))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.autoprefixer())
    .pipe($.cssnano())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.styles.dest))
    .pipe($.print(fp => `style: ${fp}`))
);

// transpile scripts, sourcemaps, minify
gulp.task('scripts', ['lint:scripts'], () =>
  gulp.src(PATHS.scripts.src)
    .pipe($.changed(PATHS.scripts.dest))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(PATHS.scripts.dest))
    .pipe($.print(fp => `script: ${fp}`))
);

// copy files over to destination
gulp.task('files', () =>
  gulp.src(PATHS.files.src)
    .pipe($.changed(PATHS.files.dest))
    .pipe(gulp.dest(PATHS.files.dest))
    .pipe($.print(fp => `file: ${fp}`))
);

// generate webfonts and css from ttf fonts
gulp.task('fonts', done => {
  // eot
  gulp.src(PATHS.fonts.src)
    .pipe($.changed(PATHS.fonts.dest))
    .pipe($.ttf2eot())
    .pipe(gulp.dest(PATHS.fonts.dest))
    .pipe($.print(fp => `font: ${fp}`));
  // woff
  gulp.src(PATHS.fonts.src)
    .pipe($.changed(PATHS.fonts.dest))
    .pipe($.ttf2woff())
    .pipe(gulp.dest(PATHS.fonts.dest))
    .pipe($.print(fp => `font: ${fp}`));
  // woff2
  gulp.src(PATHS.fonts.src)
    .pipe($.changed(PATHS.fonts.dest))
    .pipe($.ttf2woff2())
    .pipe(gulp.dest(PATHS.fonts.dest))
    .pipe($.print(fp => `font: ${fp}`));
  // css
  gulp.src(PATHS.fonts.src)
    .pipe($.changed(PATHS.fonts.dest))
    .pipe($.tap(file => {
      mkdirp(PATHS.fonts.dest, err => {
        if (err) $.util.log(err);
        const fname = path.basename(file.path, '.ttf');
        const fp = path.join(PATHS.fonts.dest, `${fname}.css`);
        const css = `@font-face {
    font-family: "${fname}";
    src: url("${fname}.eot");
    src: url("${fname}.eot?#iefix") format("embedded-opentype"),
         url("${fname}.woff2") format("woff2"),
         url("${fname}.woff") format("woff"),
         url("${fname}.ttf") format("truetype");
    font-weight: 300;
    font-style: normal;
}`;
        fs.writeFileSync(fp, css);
      });
    }))
    .pipe(gulp.dest(PATHS.fonts.dest))
    .pipe($.print(fp => `font: ${fp}`));
    done();
});

// move bower files to destination directory
gulp.task('bower', ['bower:js', 'bower:css']);
// concatenate and minify bower js
gulp.task('bower:js', () =>
  gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.js'))
    // ensure concat order
    .pipe($.print(fp => `bower: ${fp}`))
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest(PATHS.scripts.dest))
    .pipe($.print(fp => `bower: ${fp}`))
    .pipe($.cache($.uglify()))
    .pipe($.rename('vendor.min.js'))
    .pipe(gulp.dest(PATHS.scripts.dest))
    .pipe($.print(fp => `bower: ${fp}`))
);
// move bower css
gulp.task('bower:css', () =>
  gulp.src($.mainBowerFiles())
    .pipe($.changed(PATHS.styles.dest))
    .pipe($.filter('**/*.css'))
    .pipe(gulp.dest(PATHS.styles.dest))
    .pipe($.print(fp => `bower: ${fp}`))
);

// returns a function that lints the files in src
const lintTask = src =>
  () =>
    gulp.src(src)
      .pipe($.eslint())
      .pipe($.eslint.formatEach())
      .pipe($.eslint.failAfterError());
// create lint tasks for client and server scripts
for (const task of LINT) gulp.task(`lint:${task}`, lintTask(PATHS[task].src));
// lint this gulpfile
gulp.task('lint:gulpfile', lintTask('gulpfile.babel.js'));
// lint everything!
gulp.task('lint', [...LINT].map(el => `lint:${el}`).concat('lint:gulpfile'));

// create transpile tasks for server scripts
for (const task of TRANSPILE) {
  gulp.task(`transpile:${task}`, [`lint:${task}`], () =>
    gulp.src(PATHS[task].src)
      .pipe($.changed(PATHS[task].dest))
      .pipe($.babel())
      .pipe(gulp.dest(PATHS[task].dest))
      .pipe($.print(fp => `transpiled: ${fp}`))
  );
}
// transpile everything!
gulp.task('transpile', [...TRANSPILE].map(el => `transpile:${el}`));

// copy views over to destination
gulp.task('views', () =>
  gulp.src(PATHS.views.src)
    .pipe($.changed(PATHS.views.dest))
    .pipe(gulp.dest(PATHS.views.dest))
    .pipe($.print(fp => `view: ${fp}`))
);

// symlink package.json and node_modules to destination
gulp.task('ln', () =>
  vfs.src(['package.json', 'node_modules'], {
    followSymlinks: false
  })
    .pipe(vfs.symlink(DEST))
    .pipe($.print(fp => `symlink: ${fp}`))
);

// create clean tasks
for (const task of ALL) {
  gulp.task(`clean:${task}`, () => del([PATHS[task].dest]));
}
// clean everything!
gulp.task('clean', () => del([DEST]));

// clear cache
gulp.task('clear', done => $.cache.clearAll(done));

// show all tasks
gulp.task('tasks', $.taskListing);
