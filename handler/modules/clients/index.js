'use strict'

const path = require('path')

const GetClients = require('./main/GetClients')

const controllers = {
    ...GetClients.controllers,
}
const routes = [
    ...GetClients.routes
]

const prefix = '/api/v1.0/clients'

module.exports = {
    controllers,
    routes: routes
        .map(x => {
            x.prefix = prefix
            x.path = path.join(prefix, x.path)
            return x
        })
}