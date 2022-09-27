'use strict'

const jwt = require('jsonwebtoken')
const lodashResult = require('lodash.result')

module.exports = async function (req, res, next) {
    try {
        const { AppKey } = this.config
        const token = lodashResult(req.headers, 'authorization', '').replace('Bearer ', '').trim()
        if (token.length === 0) throw new Error('Required Credential')
        req.authInfo = jwt.verify(token, AppKey)
        next()
    } catch (err) {
        if (err && err.name === 'TokenExpiredError') next(new Error('Token Expired. Please Login Again'))
        else if (err.name === 'JsonWebTokenError') next(new Error('Invalid Token or Expired. Please Login Again'))
        else next(err)
    }
}