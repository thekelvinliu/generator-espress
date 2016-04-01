'use strict';

import path from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

describe('allTests', () => {
  before(done => {
    helpers.run(path.join(__dirname, '../app'))
      .withPrompts({
        projectName: 'test project',
        description: 'this is a test project',
        githubName: 'thekelvinliu'
      })
      .on('end', done);
  });

  describe('generator', () => {
    it('generator can be required', () => {
      require('../app');
    });

    it('generator creates correct files', () => {
      assert.file([
        '.babelrc',
        '.eslintrc.json',
        'bower.json',
        'gulpfile.babel.json',
        'package.json',
        'src'
      ]);
    });

    it('generator correctly does templates');

    it('generator fails when project name already exists');
  });

  describe('git', () => {
    it('.git directory is created');
  });

});
