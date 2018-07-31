let CUR_TEXT = ''
const {sleep} = require('../utils')

module.exports = class Command {
    constructor (options) {
        this.bot = options.bot
        this.triggerStatus = options.default
        this.contact = null
    }
    init () {
        this.openCommand = '开启' + this.commandName
        this.closeCommand = '关闭' + this.commandName
        this.prefixCommand = '#' + this.commandName
        this.opendCallBackText = this.commandName + '已开启'
        this.closedCallBackText = this.commandName + '已关闭'
    }
    getKeyword (text) {
        let kw = text.split(this.prefixCommand)[1]
        return kw ? kw.trim() : null
    }
    getStatus () {
        return {
            status: this.triggerStatus,
            text: this.triggerStatus ? this.opendCallBackText : this.closedCallBackText
        }
    }
    async run (msg) {
        CUR_TEXT = msg.text()
        let msgTo = msg.to()
        this.contact = msgTo ? msgTo : msg
        await this.trigger(msg)
        if (
            !this.triggerStatus || 
            CUR_TEXT === this.opendCallBackText ||
            CUR_TEXT === this.closedCallBackText ||
            CUR_TEXT === this.openCommand ||
            CUR_TEXT === this.closeCommand 
        ) {
            return false
        }
        await this.exec(msg)
    }
    async exec (msg) {

    }
    async trigger (msg) {
        try {
            if (CUR_TEXT === this.closeCommand) {
                this.triggerStatus = false
                await sleep(1000, true)
                await this.contact.say(this.closedCallBackText)
            }
            if (CUR_TEXT === this.openCommand) {
                this.triggerStatus = true
                await sleep(1000, true)
                await this.contact.say(this.opendCallBackText)
            }
        } catch (e) {
            console.error(`${this.commandName} 指令执行出错：`, e);
        }
    }
}