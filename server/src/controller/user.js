const Base = require('./base.js');
const codeMap = require('../codeMap')

module.exports = class extends Base {
  async __before() {
    this.ctx.state.robotModel = this.mongo('robot')
    this.ctx.state.user = this.mongo('user')
  }
  async indexAction() {
    const user = this.ctx.state.user
    const robotModel = this.ctx.state.robotModel
    const curUser = await user.isLogin(this)
    if (!curUser) {
      const code = 901
      return this.ctx.fail(code, codeMap[code])
    }
    switch (this.method) {
      // 获取用户信息
      case 'GET':
        delete curUser.token
        // 连接robot表
        curUser.robotList = await robotModel.getRobotListByProfileList(curUser.robotList)
        this.ctx.success(curUser, '获取用户成功')
        break
    }
  }
  // 用户登录 post
  async loginAction() {
    if (!this.isPost) return
    const user = this.mongo('user')
    const token = user.getDefaultToken()
    const curUser = await user.find({token})
    if (curUser) {
      this.cookie('token', token)
      delete curUser.token
      // 连接robot表
      const robotModel = this.mongo('robot')
      curUser.robotList = await robotModel.getRobotListByProfileList(curUser.robotList)
      this.ctx.success(curUser, '登录成功')
    } else {
      const code = 801
      this.ctx.fail(code, codeMap[code])
    }
  }
};
