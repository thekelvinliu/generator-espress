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
        'bower.json',
        'gulpfile.babel.js',
        'package.json',
        'src/app/controllers/index.js',
        'src/app/controllers/extras.js',
        'src/app/models/index.js',
        'src/app/models/movie.js',
        'src/app/views/error.jade',
        'src/app/views/extras.jade',
        'src/app/views/index.jade',
        'src/app/views/layout.jade',
        'src/app/views/movies.jade',
        'src/app.js',
        'src/fonts/Raleway-Regular.ttf',
        'src/images/favicon.png',
        'src/scripts/fadeIn.js',
        'src/styles/error.scss',
        'src/styles/extras.scss',
        'src/styles/main.scss'
      ]);
      chai.assert.equal(pathExists.sync('src/files'), true);
    });

    it('files have no templating syntax', () => {
      assert.noFileContent([
        ['.gitignore', '<%= '],
        ['bower.json', '<%= '],
        ['gulpfile.babel.js', '<%= '],
        ['LICENSE', '<%= '],
        ['package.json', '<%= '],
        ['README.md', '<%= '],
        ['src/app/controllers/index.js', '<%= '],
        ['src/app/views/layout.jade', '<%= ']
      ]);
    });

    it('correctly templates files', () => {
      assert.jsonFileContent('bower.json', {
        name: NAME,
        description: OPTS.description
      });
      assert.jsonFileContent('package.json', {
        name: NAME,
        description: OPTS.description,
        author: OPTS.githubName,
        repository: `${OPTS.githubName}/${NAME}`
      });
      assert.fileContent([
        ['.gitignore', OPTS.buildDir],
        ['gulpfile.babel.js', `const DEST = '${OPTS.buildDir}';`],
        ['LICENSE', OPTS.githubName],
        ['README.md', `# ${NAME}`],
        ['README.md', OPTS.description],
        ['src/app/controllers/index.js', `title: '${NAME}'`],
        ['src/app/views/layout.jade', `content='${escape(OPTS.description)}'`]
      ]);
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
