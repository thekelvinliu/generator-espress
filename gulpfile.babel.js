'use strict';

import path from 'path';
import del from 'del';
import gulp from 'gulp';
import plugins from 'gulp-load-plugins';
const $ = plugins();

const SRC = 'src';
const DEST = '.';
const PATHS = {
  app: {
    src: path.join(SRC, 'app/**/*.js'),
    dest: path.join(DEST, 'app')
  },
  templates: {
    src: path.join(SRC, 'templates/**/*'),
    dest: path.join(DEST, 'app/templates')
  },
  test: {
    src: path.join(SRC, 'test/**/*.js'),
    dest: path.join(DEST, 'test')
  }
};

// default task builds and tests code
gulp.task('default', ['test']);

// test code
gulp.task('test', ['build']);

// watch code and automatically transpile
gulp.task('watch', ['build'], () => {
  gulp.watch(PATHS.app.src, ['babel:app']);
  gulp.watch(PATHS.test.src, ['babel:test']);
  gulp.watch(PATHS.templates.src, ['templates']);
});

// build generator by transpiling es6 code and moving templates
gulp.task('build', ['babel', 'templates']);

// returns a function that lints code
const lintTask = (obj) =>
  () =>
    gulp.src(obj.src)
      .pipe($.plumber())
      .pipe($.eslint())
      .pipe($.eslint.format())
      .pipe($.eslint.failAfterError())
// lint code
gulp.task('lint', ['lint:app', 'lint:test']);
gulp.task('lint:app', lintTask(PATHS.app));
gulp.task('lint:test', lintTask(PATHS.test));

// returns a function that transpiles es6 code to js
const babelTask = (obj) =>
  () =>
    gulp.src(obj.src)
      .pipe($.babel())
      .pipe(gulp.dest(obj.dest))
      .pipe($.print(fp => `babel'd: ${fp}`))
// transpile es6
gulp.task('babel', ['babel:app', 'babel:test']);
gulp.task('babel:app', ['lint:app'], babelTask(PATHS.app));
gulp.task('babel:test', ['lint:test'], babelTask(PATHS.test));

// move templates
gulp.task('templates', () =>
  gulp.src([PATHS.templates.src])
    .pipe(gulp.dest(PATHS.templates.dest))
);

// cleanup directory
gulp.task('clean', ['clean:app', 'clean:test'])
gulp.task('clean:app', () => del([PATHS.app.dest]));
gulp.task('clean:test', () => del([PATHS.test.dest]));
