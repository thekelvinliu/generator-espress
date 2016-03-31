'use strict';

import path from 'path';
import { Base } from 'yeoman-generator';
// import mkdirp from 'mkdirp';
import pathExists from 'path-exists';
import simpleGit from 'simple-git';
import slug from 'slug';

class MyGenerator extends Base {
  constructor(...args) {
    super(...args);
    slug.defaults.mode = 'rfc3986';
    this.opts = {
      year: new Date().getFullYear()
    };
    this.files = [
      '.babelrc',
      '.eslintrc.json',
      '.gitignore',
      'bower.json',
      'gulpfile.babel.js',
      'LICENSE',
      'package.json',
      'README.md'
    ];
  }

  prompting() {
    const done = this.async();
    const prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Enter the name of your project:',
      default: 'name-of-your-project'
    }, {
      type: 'input',
      name: 'description',
      message: 'Enter a description of your project:'
    }, {
      type: 'input',
      name: 'githubName',
      message: 'Enter your github username:',
      store: true
    }, {
      type: 'input',
      name: 'buildDir',
      message: 'Enter the name of your build directory:',
      default: 'build'
    }];
    this.prompt(prompts, res => {
      this.opts.projectName = slug(res.projectName);
      const dir = path.join('.', this.opts.projectName);
      if (!pathExists.sync(dir)) this.destinationRoot(dir);
      else this.env.error(`the directory '${this.opts.projectName}' already exists!`);
      this.git = simpleGit(this.destinationRoot());
      this.opts.description = res.description;
      this.opts.githubName = res.githubName;
      this.opts.buildDir = slug(res.buildDir);
      done();
    });
  }

  get writing() {
    return {
      // create root directory files
      rootFiles() {
        this.fs.copy(
          this.templatePath('babelrc'),
          this.destinationPath('.babelrc')
        );
        this.fs.copy(
          this.templatePath('eslintrc.json'),
          this.destinationPath('.eslintrc.json')
        );
        this.fs.copyTpl(
          this.templatePath('_bower.json'),
          this.destinationPath('bower.json'),
          this.opts
        );
        this.fs.copyTpl(
          this.templatePath('_gulpfile.babel.js'),
          this.destinationPath('gulpfile.babel.js'),
          this.opts
        );
        this.fs.copyTpl(
          this.templatePath('_LICENSE'),
          this.destinationPath('LICENSE'),
          this.opts
        );
        this.fs.copyTpl(
          this.templatePath('_package.json'),
          this.destinationPath('package.json'),
          this.opts
        );
      },
      // express app config and files
      app() {
      },
      // create local git and commit all files
      git() {
        this.fs.copyTpl(
          this.templatePath('gitignore'),
          this.destinationPath('.gitignore'),
          this.opts
        );
        this.fs.copyTpl(
          this.templatePath('_README.md'),
          this.destinationPath('README.md'),
          this.opts
        );
        this.git
          .init()
          .add('.')
          .commit(`${this.opts.projectName} initial commit`);
      }
    };
  }

  install() {
    // this.installDependencies();
  }

  end() {
    this.log(`'${this.opts.projectName}' is all set up and ready to go!`);
  }
}

module.exports = MyGenerator;
