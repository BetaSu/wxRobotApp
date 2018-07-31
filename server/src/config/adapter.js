const fileCache = require('think-cache-file');
const nunjucks = require('think-view-nunjucks');
const fileSession = require('think-session-file');
// const mysql = require('think-model-mysql');
const {Console, File, DateFile} = require('think-logger3');
const socketio = require('think-websocket-socket.io')
const path = require('path');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mongo',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mongo: {
    host: '127.0.0.1',
    port: 27017,
    user: '',
    password: '',
    database: 'wxrobot', // 数据库名称
    options: {
      // replicaSet: 'mgset-3074013',
      // authSource: 'admin'
    }
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs'
      // keys: ['werwer', 'werwer'],
      // signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

exports.websocket = {
  type: 'socketio',
  common: {
    // common config
  },
  socketio: {
    handle: socketio,
    // 默认所有的域名都允许访问
    allowOrigin: '127.0.0.1:8360',
    path: '/socket.io',
    adapter: null,
    messages: {
      open: '/websocket/open',
      close: '/websocket/close',
      addRot: '/websocket/addRot'
    }
  }
}
