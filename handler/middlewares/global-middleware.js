'use strict'

const { AppVersion } = require('../../config')
const uuid = require('uuid').v4

const reqIdMiddleware = (req, res, next) => {
    console.log(req.method, req.url)
    req.headers['x-req-id'] = uuid()
    req.headers['user-agent'] = 'API-Gateway v' + AppVersion
    next()
}

module.exports = [ reqIdMiddleware ]