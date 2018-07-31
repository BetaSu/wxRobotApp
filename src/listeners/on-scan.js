module.exports = async (ctl, url, code) => {
  let loginUrl = url.replace('qrcode', 'l')
  ctl.ctx.response.type = 'json'
  if (code === 0) {
    // require('qrcode-terminal').generate(loginUrl)
    ctl.ctx.success({
      qrcode: loginUrl,
      isLogin: false,
      code
    }, '获取二维码成功')
  } else {
    ctl.ctx.fail(code, '获取二维码失败', {
      isLogin: false
    })
  }
}
