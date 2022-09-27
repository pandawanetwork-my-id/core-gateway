'use strict'

const path = require('path')

const controllers = require('./APIGateway')

const routes = [{
    method: 'all',
    path: '*',
    middlewares: [],
    controller: 'handle'
}]

const prefix = '/gateway/v1'

module.exports = {
    controllers,
    routes: routes
        .map(x => {
            x.prefix = prefix
            x.path = path.join(prefix, x.path)
            return x
        })
}