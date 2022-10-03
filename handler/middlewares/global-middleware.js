'use strict'

const { AppVersion } = require('../../config')
const uuid = require('uuid').v4

const reqIdMiddleware = (req, res, next) => {
    console.log(req.method, req.url)
    const headers = req.headers
    const xClientId = headers['x-client-id']
    const xAPIKey = headers['x-api-key']
    req.headers['x-req-id'] = uuid()
    req.headers['user-agent'] = 'API-Gateway v' + AppVersion
    if (!xClientId) throw new Error('X-CLIENT-ID Header REQUIRED')
    if (!xAPIKey) throw new Error('X-API-KEY Header REQUIRED')
    next()
}

module.exports = [ reqIdMiddleware ]