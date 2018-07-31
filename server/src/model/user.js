// const crypto = require('crypto');

// const PRIVATE_KEY = 'aa66aa'

// const createToken = str => {
//   const hash = crypto.createHash('md5');
//   hash.update(Math.random() * 10000 + str + PRIVATE_KEY);
//   return hash.digest('hex')
// };

const CUR_USER_TOKEN = 'f78b6f6a960a509284bbd3a3f000f1ce'

module.exports = class extends think.Mongo {
  getDefaultToken() {
    return CUR_USER_TOKEN
  }
  getDefaultUser() {
    return this.find({ token: CUR_USER_TOKEN })
  }
  async getUserByToken(token) {
    if (!token) return
    const u = await this.find({token})
    return u
  }
  async isLogin(ctl) {
    return this.getUserByToken(ctl.cookie('token'))
  }
};
