const { FileBox } = require('file-box')
const axios = require('axios')

const Command = require('../command')
const {sleep} = require('../../utils')

let recallTxtList = []

/**
 * 搜索图片
 */
module.exports = class SearchPic extends Command {
    constructor (options) {
        super(options)
        this.bot = options.bot
        this.commandName = '图片搜索'
        this.init()
        this.prefixCommand = '#图片'
    }
    async exec (msg) {
        let kw = this.getKeyword(msg.text())
        if (!kw) return
        await sleep(1000, true)
        if (msg.type() === this.bot.Message.Type.Text) {
            let txt = msg.text()
            let imgUrl = await searchPic(kw)
            if (imgUrl) {
                const fileBox = FileBox.fromUrl(imgUrl)
                await this.contact.say(fileBox)
            } else {
                await this.contact.say(`未找到 ${kw} 相关图片`)
            }
        }
    }
}

// 启用360图片搜索 呈现第一张图
function searchPic(keyword) {
    return axios.get('http://image.so.com/j', {
        params: {
            src: 'srp',
            q: keyword,
            correct: keyword,
            // 起始 Index
            sn: 1,
            // 图片数
            pn: 1,
            // 动/静 态图片，如 ‘d’ 为动态
            // t: 'd'
        }
    }).then(res => {
        if (res.statusText === 'OK' && res.data && res.data.list && res.data.list.length) {
            return res.data.list[0].img
        }
    })
}