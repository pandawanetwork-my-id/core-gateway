'use strict'

const path = require('path')
const Login = require('./APIRoutes/Login')
const GatewayRouteCreate = require('./APIRoutes/Gateway/CreateRoute')
const GatewayRouteUpdate = require('./APIRoutes/Gateway/UpdateRoute')
const GatewayRouteDelete = require('./APIRoutes/Gateway/DeleteRoute')
const GatewayRouteActivate = require('./APIRoutes/Gateway/ActivateRoute')
const GatewayRouteDeactivate = require('./APIRoutes/Gateway/DeactivateRoute')
const GatewayRouteList = require('./APIRoutes/Gateway/ListRoute')

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