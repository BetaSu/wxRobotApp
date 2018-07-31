
module.exports = class extends think.Controller {
  indexAction() {
    console.log(this)
    this.body = 'hello websocket'
    // return this.display();
  }
  openAction() {
    console.log('call on open!!!!');
    this.emit('opend', 'This client opened successfully!')
    this.broadcast('joined', 'There is a new client joined successfully!')
  }
  closeAction() {
    console.log('i am close!!!');
  }
  addRotAction() {
    console.log('add rot!!!');
    this.body = 'add rot'
  }
};
