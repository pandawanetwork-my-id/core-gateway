'use strict'

module.exports = async function (req, res, next) {
    try {
        const headers = req.headers
        const xClientId = headers['x-client-id']
        const xAPIKey = headers['x-api-key']
        if (!xClientId) throw new Error('X-CLIENT-ID Header REQUIRED')
        if (!xAPIKey) throw new Error('X-API-KEY Header REQUIRED')
        next()
    } catch (err) {
        throw err
    }
}