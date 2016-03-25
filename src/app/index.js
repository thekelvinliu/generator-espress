'use strict';

import path from 'path';
import { Base } from 'yeoman-generator';

class MyGenerator extends Base {
  constructor(...args) {
    super(...args);
    this.argument('appName', {
      type: String,
      defaults: path.basename(process.cwd())
    });
  }

  initializing() {
    console.log('init');
  }

  get prompting() {
    return {
      one() {
        console.log('one');
      },
      two() {
        console.log('two');
      }
    };
  }
}

module.exports = MyGenerator;
