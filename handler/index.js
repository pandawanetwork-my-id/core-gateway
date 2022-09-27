'use strict'

const dashboardModule = require('./modules/dashboard')
const gatewayModule = require('./modules/gateway')
const clientsModule = require('./modules/clients')

const middlewares = require('./middlewares/index')
const globalMiddlewares = require('./middlewares/globalMiddleware')

let controllers = {
    ...dashboardModule.controllers,
    ...clientsModule.controllers,


    // (exclusive) last controllers
    ...gatewayModule.controllers
}
let routes = [
    ...dashboardModule.routes,
    ...clientsModule.routes,



    // (exclusive) last routes
    ...gatewayModule.routes
]

module.exports = { routes, controllers, middlewares, globalMiddlewares }