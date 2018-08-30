const liveServer = require('live-server')

const params = {
  port: 8686,
  host: '0.0.0.0',
  root: 'example',
  open: false,
  wait: 1000,
  logLevel: 2,
  middleware: [
    (req, res, next) => next()
  ],
}

liveServer.start(params)
