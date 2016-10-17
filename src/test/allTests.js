'use strict';

import path from 'path';
import chai from 'chai';
import escape from 'escape-html';
import pathExists from 'path-exists';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

const OPTS = {
  projectName: 'test project',
  description: 'this is a test project',
  githubName: 'thekelvinliu',
  buildDir: 'custom_dir'
};
const NAME = 'test-project';

describe('allTests', () => {
  before(done => {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts(OPTS)
      .on('end', done);
  });

  describe('generator', () => {
    it('can be required', () => {
      require('../app');
    });

    it('creates correct files', () => {
      assert.file([
        '.babelrc',
        '.eslintrc.json',
        '.gitignore',
        'LICENSE',
        'README.md',
        'bower.json',
        'gulpfile.babel.js',
        'package.json',
        'src/app.js',
        'src/config.js',
        'src/app/controllers/index.js',
        'src/app/controllers/extras.js',
        'src/app/helpers/logger.js',
        'src/app/models/index.js',
        'src/app/models/movie.js',
        'src/app/views/error.pug',
        'src/app/views/extras.pug',
        'src/app/views/index.pug',
        'src/app/views/movies.pug',
        'src/app/views/layout/base.pug',
        'src/fonts/Raleway-Regular.ttf',
        'src/images/favicon.png',
        'src/scripts/fadeIn.js',
        'src/styles/error.scss',
        'src/styles/extras.scss',
        'src/styles/main.scss'
      ]);
      chai.assert.equal(pathExists.sync('src/files'), true);
    });
  });

  describe('files', () => {
    it('have no templating syntax', () => {
      assert.noFileContent([
        ['.gitignore', '<%= '],
        ['bower.json', '<%= '],
        ['gulpfile.babel.js', '<%= '],
        ['LICENSE', '<%= '],
        ['package.json', '<%= '],
        ['README.md', '<%= '],
        ['README.md', '<%- '],
        ['src/app/controllers/index.js', '<%= '],
        ['src/app/views/layout/base.pug', '<%= ']
      ]);
    });

    it('are correctly templated', () => {
      assert.fileContent([
        ['.gitignore', OPTS.buildDir],
        ['gulpfile.babel.js', `const DEST = '${OPTS.buildDir}';`],
        ['LICENSE', OPTS.githubName],
        ['README.md', `# ${NAME}`],
        ['README.md', OPTS.description],
        ['src/app/controllers/index.js', `title: '${NAME}'`],
        [
          'src/app/views/layout/base.pug',
          `content='${escape(OPTS.description)}'`
        ]
      ]);
      assert.jsonFileContent('bower.json', {
        name: NAME,
        description: escape(OPTS.description)
      });
      assert.jsonFileContent('package.json', {
        name: NAME,
        description: escape(OPTS.description),
        author: OPTS.githubName,
        repository: `${OPTS.githubName}/${NAME}`
      });
    });
  });

  describe('git', () => {
    it('directory has .git', () => {
      assert.file([
        '.git/HEAD',
        '.git/config',
        '.git/description'
      ]);
    });
  });

});
