// const {runningBotMap} = require('../robot-utils')
// const codeMap = require('../../server/src/codeMap')

// module.exports = async(ctl, profile, params, user) => {
//   // 更新数据登录状态
//   const robotModel = ctl.mongo('robot')
//   robotModel.updateByProfile({status: 'login'}, profile)
//   console.log('params', params);
//   console.log(`${user} login`)
//   if (ctl.ctx.headerSent) return
//   const code = 200
//   console.log('fail!!!!');
//   ctl.ctx.fail(code, codeMap[code])
// }
