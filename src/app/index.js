'use strict';

import path from 'path';
import { Base } from 'yeoman-generator';
import pathExists from 'path-exists';
import slug from 'slug';

class MyGenerator extends Base {
  constructor(...args) {
    super(...args);
    slug.defaults.mode = 'rfc3986';
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
      this.options.projectName = slug(res.projectName);
      const dir = path.join('.', this.options.projectName);
      if (!pathExists.sync(dir)) this.destinationRoot(dir);
      else this.env.error(`${this.options.projectName} already exists.`);
      this.options.description = res.description;
      this.options.githubName = res.githubName;
      this.options.buildDir = slug(res.buildDir);
      done();
    });
  }

  get writing() {
    return {
      babelrc() {
        this.fs.copy(
          this.templatePath('babelrc'),
          this.destinationPath('.babelrc')
        );
      },
      bowerJson() {
        this.fs.copyTpl(
          this.templatePath('_bower.json'),
          this.destinationPath('bower.json'),
          {
            projectName: this.options.projectName,
            description: this.options.description
          }
        );
      },
      eslintJson() {
        this.fs.copy(
          this.templatePath('eslintrc.json'),
          this.destinationPath('.eslintrc.json')
        );
      },
      gitignore() {
        this.fs.copy(
          this.templatePath('gitignore'),
          this.destinationPath('.gitignore')
        )
      },
      packageJson() {
        this.fs.copyTpl(
          this.templatePath('_package.json'),
          this.destinationPath('package.json'),
          {
            projectName: this.options.projectName,
            description: this.options.description,
            githubName: this.options.githubName
          }
        );
      }
    };
  }

  end() {
    this.log(`${this.options.projectName} is set up and ready to go!`);
  }
}

module.exports = MyGenerator;
