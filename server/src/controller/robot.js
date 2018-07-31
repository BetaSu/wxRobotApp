const Base = require('./base.js');
const {getRobot, getRunningBots} = require('../../../src/robot-utils')
// const onLogin = require('../../../src/listeners/on-login')
const onMessage = require('../../../src/listeners/on-message')
const onFriend = require('../../../src/listeners/on-friend')
const codeMap = require('../codeMap')

module.exports = class extends Base {
  // 先判断登录状态 获取用户信息
  async __before() {
    const user = this.mongo('user')
    const curUser = await user.isLogin(this)
    if (!curUser) {
      const code = 901
      this.fail(code, codeMap[code])
      return false
    }
    this.ctx.state.curUser = curUser
    this.ctx.state.user = user
    this.ctx.state.robot = this.mongo('robot')
    return true
  }
  /**
   * 如果子进程意外退出，机器人状态不会重置为未登录 get
   * 所以需要检查是否发生这种情况，并手动重制所有机器人状态
   */
  async inspectAction() {
    if (!this.ctx.isGet) return
    const runningLength = getRunningBots().length
    if (!runningLength) {
      await this.ctx.state.robot.setLogoutParamAllRobot()
      return this.success({
        needUpdate: true
      }, '需要更新')
    }
    this.success({
      needUpdate: false
    }, '不需要更新')
  }
  async indexAction() {
    const curUser = this.ctx.state.curUser
    const user = this.ctx.state.user
    const curRobotList = curUser.robotList
    // 获取机器人列表 get
    if (this.ctx.isGet) {
      const robotList = await this.ctx.state.robot.getRobotListByProfileList(curRobotList)
      return this.success(robotList, '获取规则列表成功')
    }

    // 新增机器人规则 post
    if (!this.ctx.isPost) return
    // 达到当前用户可添加规则的上限
    if (curRobotList.length >= curRobotList.allowed_bot) {
      const code = 701
      return this.fail(code, codeMap[code])
    }
    const newRobot = await this.ctx.state.robot.createRobot({owner: curUser._id})
    await curRobotList.push(newRobot.profile)
    await user.update({robotList: curRobotList})
    this.ctx.success(newRobot, '新增规则成功')
  }
  // 登录机器人 post
  async loginAction() {
    if (!this.ctx.isPost) return
    const curUser = this.ctx.state.curUser
    const profile = this.post('profile')
    // 验证profile是否属于当前用户
    if (!curUser.robotList.some(p => profile === p)) {
      const code = 702
      return this.fail(code, codeMap[code])
    }
    const robot = await getRobot(profile)
    // 验证当前机器人是否已经登录
    const robotData = await this.ctx.state.user.getInfoByProfile(profile)
    if (robotData.status === 'login') {
      const code = 902
      return this.fail(code, codeMap[code])
    }
    // 先绑定事件
    await new Promise((resolve, reject) => {
      robot.on('scan', (url, code) => resolve({url, code, type: 'scan'}))
      robot.on('login', (params, user) => resolve({params, user, type: 'login'}))
      robot.on('message', onMessage.bind(this))
      robot.on('friendship', onFriend.bind(this))
      robot.on('logout', async() => {
        await this.ctx.state.robot.updateByProfile({status: 'notLogin'}, profile)
      })
        .start().catch(async e => {
          console.log(`Init() fail: ${e}.`)
          await this.ctx.state.robot.updateByProfile({status: 'notLogin'}, profile)
          process.exit(1)
        })
    }).then(({url, code, type, params, user}) => {
      switch (type) {
        case 'login':
          // 更新数据登录状态
          this.ctx.state.robot.updateByProfile({status: 'login'}, profile)
          console.log('params', params);
          console.log(`${user} login`)
          if (this.ctx.headerSent) return
          const code = 200
          this.fail(code, codeMap[code])
          break
        case 'scan':
          const loginUrl = url.replace('qrcode', 'l')
          this.ctx.response.type = 'json'
          if (code === 0) {
            this.ctx.success({
              qrcode: loginUrl,
              isLogin: false
            }, '获取二维码成功')
          } else {
            this.fail(code, '获取二维码失败', {isLogin: false})
          }
          break
      }
    })
  }
};
