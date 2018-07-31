const Command = require('../command')
const {sleep} = require('../../utils')

let recallTxtList = []

/**
 * 防文字撤回 暂不可用
 */
module.exports = class preventRecall extends Command {
    constructor (options) {
        super(options)
        this.openCommand = '开启防撤回'
        this.closeCommand = '关闭防撤回'
        this.opendCallBackText = '防撤回已开启'
        this.closedCallBackText = '防撤回已关闭'
        this.prefix = '撤回的语句：'
    }
    async exec (msg) {
        await sleep(2000, true)
        if (msg.type() === this.options.bot.Message.Type.Text) {

            msg.say(this.prefix + msg.text())
        }
    }
}