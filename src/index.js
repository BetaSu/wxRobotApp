/**
 * Based on the Wechaty hot import bot example
 *
 * Hot import Wechaty listenser functions after change the source code without restart the program
 *
 * P.S. We are using the hot-import module:
 *   * Hot Module Replacement(HMR) for Node.js
 *   * https://www.npmjs.com/package/hot-import
 *
 */

const finis = require('finis')
const { Wechaty } = require('wechaty')

async function initRobot() {
  const bot = Wechaty.instance({
    profile: 'wx',
    puppet: "puppeteer"
  })

  bot
    .on('scan',     './listeners/on-scan')
    // .on('login',    './listeners/on-login')
    .on('message',  './listeners/on-message')
    // .on('friendship',   './listeners/on-friend')
    .start()
    .catch(async function(e) {
      console.log(`Init() fail: ${e}.`)
      await bot.stop()
      process.exit(1)
    })
}

initRobot()

finis((code, signal, error) => {
  console.log('Importand data saved at this step.')
  
  // await bot.stop()
  // bot.stop()
  console.log(`Wechaty exit ${code} because of ${signal}/${error})`)
  process.exit(1)
})

