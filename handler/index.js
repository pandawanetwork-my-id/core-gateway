'use strict'

const dashboardModule = require('./modules/dashboard')
const gatewayModule = require('./modules/gateway')
const clientsModule = require('./modules/clients')

const middlewares = require('./middlewares/index')
const globalMiddlewares = require('./middlewares/global-middleware')

let controllers = {
    ...dashboardModule.controllers,
    ...clientsModule.controllers,
    GatewayMainPage: ({ response }) =>{
        response.send({foo: 'bar'})
    },

    // (exclusive) last controllers
    ...gatewayModule.controllers
}
let routes = [
    {
        method: 'all',
        path: '/',
        middlewares: [],
        controller: 'GatewayMainPage'
    },
    ...dashboardModule.routes,
    ...clientsModule.routes,



    // (exclusive) last routes
    ...gatewayModule.routes
]

module.exports = { routes, controllers, middlewares, globalMiddlewares }