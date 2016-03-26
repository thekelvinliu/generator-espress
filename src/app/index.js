'use strict';

// import path from 'path';
import { Base } from 'yeoman-generator';
import slug from 'slug';

class MyGenerator extends Base {
  constructor(...args) {
    super(...args);
    slug.defaults.mode = 'rfc3986';
  }

  get prompting() {
    return {
      projectName() {
        const done = this.async();
        this.prompt({
          type: 'input',
          name: 'projectName',
          message: 'Enter the name of your project:',
          default: 'name-of-your-project'
        }, res => {
          this.options.projectName = slug(res.projectName);
          done();
        });
      },

      destDir() {
        const done = this.async();
        this.prompt({
          type: 'input',
          name: 'destDir',
          message: 'Enter the name of your destination folder:',
          default: 'build'
        }, res => {
          this.options.destDir = slug(res.destDir);
          done();
        });
      }
    };
  }

  end() {
    this.log(`${this.options.projectName} is set up and ready to go!`);
  }
}

module.exports = MyGenerator;
