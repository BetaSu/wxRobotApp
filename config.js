module.exports = {
  db: {
    host: '127.0.0.1',
    port: 27017,
    name: 'wxrobot'
  },
  redis: {
    default: {
      port: 6379
    },
    development: {
      host: '127.0.0.1'
    },
    production: {
      host: '192.168.0.11'
    }
  },
  friendEnabled: false
}
