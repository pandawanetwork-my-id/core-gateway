'use strict'

const { version, api_version: apiVersion } = require('./package.json')

module.exports = {
    AppVersion: version,
    ApiVersion: apiVersion,
    AppKey: process.env.APP_KEY,
    AppHost: process.env.APP_HOST,
    AppPort: process.env.APP_PORT,
    // session
    SessionExpires: process.env.SESSION_EXPIRES,
    // redis
    RedisDSN: process.env.REDIS_DSN,
    // mongodb
    MongodbDSN: process.env.MONGODB_DSN,
    // gateway config
    GatewayPrefixPath: process.env.GATEWAY_PREFIX_PATH,
    gatewayConfig: {
        statuses: {
            1: 'Active',
            0: 'Trash',
            2: 'Pending'
        }
    },
    // Dependencies Installed
    dependencies: {
        uuid: require('uuid'),
        md5: require('md5'),
        lodashResult: require('lodash.result'),
        lodashIsObject: require('lodash.isobject'),
        redis: require('redis'),
        jwt: require('jsonwebtoken')
    },
    // mysql connection config
    mysqlConnection: {
        dsn : process.env.MYSQL_DSN,
        debug: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
}