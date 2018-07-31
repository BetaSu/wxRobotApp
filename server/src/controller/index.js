const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    console.log(this)
    this.body = 'hello world'
    // return this.display();
  }
};
