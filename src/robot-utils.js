// const finis = require('finis')
const {Wechaty} = require('wechaty')

/**
 * 机器人工具 
 */

// 所有运行的机器人
const runningBotMap = {}

exports.getRobot = async function (profile = 'default') {
    if (runningBotMap[profile]) return runningBotMap[profile]
    runningBotMap[profile] = await Wechaty.instance({profile, puppet: "puppeteer"})
    return runningBotMap[profile]
}

// warning: 务必等实例调用start后再使用
exports.robotIsLogin = async function (profile = 'default') {
    const bot = runningBotMap[profile]
    if (!bot) return
    return bot.logonoff()
}

// 返回所有运行的实例
exports.getRunningBots = () => {
    return Object.values(runningBotMap)
}
