const {sleep} = require('../utils')

// const PreventRecall = require('./commands/prevent-recall')
const SearchPic = require('./commands/search-pic')

let commands = [SearchPic]

let inited = false

// 我自己发出的指令
module.exports = function execCommands(message, bot) {
    if (!inited) {
        commands = commands.map(Cmd => new Cmd({
            bot,
            default: true
        }))
        inited = true
    }
    if (message.self()) {
        commands.forEach(cmd => cmd.run(message))
    }
}