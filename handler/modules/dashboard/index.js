'use strict'

const path = require('path')
const Login = require('./api-routes/login')
const GatewayRouteCreate = require('./api-routes/gateway/create-route')
const GatewayRouteUpdate = require('./api-routes/gateway/update-route')
const GatewayRouteDelete = require('./api-routes/gateway/delete-route')
const GatewayRouteActivate = require('./api-routes/gateway/activate-route')
const GatewayRouteDeactivate = require('./api-routes/gateway/deactivate-route')
const GatewayRouteList = require('./api-routes/gateway/list-route')

const routes = [
    ...Login.routes,
    ...GatewayRouteCreate.routes,
    ...GatewayRouteUpdate.routes,
    ...GatewayRouteDelete.routes,
    ...GatewayRouteActivate.routes,
    ...GatewayRouteDeactivate.routes,
    ...GatewayRouteList.routes,
]
const prefix = '/api/{api_version}'

module.exports = {
    routes: routes
        .map(x => {
            x.path = path.join(prefix, x.path)
            return x
        }),
    controllers: {
        ...Login.controllers,
        ...GatewayRouteCreate.controllers,
        ...GatewayRouteUpdate.controllers,
        ...GatewayRouteDelete.controllers,
        ...GatewayRouteActivate.controllers,
        ...GatewayRouteDeactivate.controllers,
        ...GatewayRouteList.controllers,
    }
}