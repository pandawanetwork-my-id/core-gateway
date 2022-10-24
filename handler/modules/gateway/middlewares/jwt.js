'use strict'

const jsonwebtoken = require('jsonwebtoken')
const result = require('lodash.result')

module.exports = async function ({req, config, helpers, plugins, routeConfig}) {
    try {
        const { RouterGatewayHelper } = helpers
        const { redis } = plugins.model
        const { adminUser } = req.authInfo || {}

        const token = req.headers.authorization
        const appKey = config.AppKey
        if (!token) throw new Error('Invalid Token')
        const validToken = token.replace('Bearer ', '').trim()
        const decoded = jsonwebtoken.verify(validToken, appKey)
        const clientId = result(decoded, 'payload.data.c')
        const projectIds = result(decoded, 'payload.data.p')
        if (!clientId) throw new Error('Invalid Token')
        return projectIds.join()
    } catch (err) {
        throw err
    }
}