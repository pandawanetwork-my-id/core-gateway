const jsonwebtoken = require('jsonwebtoken')
const result = require('lodash.result')

module.exports = {
    extractFromRipple10Token: async (stringToken, config={}) => {
        const appKey = config.AppKey
        const validToken = stringToken.replace('Bearer ', '').trim()
        const decoded = jsonwebtoken.verify(validToken, appKey)
        const clientId = result(decoded, 'payload.data.c')
        return { clientId }
    }
}