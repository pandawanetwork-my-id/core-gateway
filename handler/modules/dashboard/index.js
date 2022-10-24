'use strict'

const path = require('path')
const Login = require('./api-routes/login')
const GatewayRouteCreate = require('./api-routes/gateway/routes-controller/create')
const GatewayRouteUpdate = require('./api-routes/gateway/routes-controller/update')
const GatewayRouteTrash = require('./api-routes/gateway/routes-controller/trash')
const GatewayRouteDelete = require('./api-routes/gateway/routes-controller/delete')
const GatewayRoutePing = require('./api-routes/gateway/routes-controller/ping')
const GatewayRouteActivate = require('./api-routes/gateway/routes-controller/activate')
const GatewayRouteDeactivate = require('./api-routes/gateway/routes-controller/deactivate')
const GatewayRouteList = require('./api-routes/gateway/routes-controller/list')
// configs
const GatewayConfigRoutesAllDomains = require('./api-routes/gateway/extras/all-domains')

const routes = [
    ...Login.routes,
    ...GatewayRouteCreate.routes,
    ...GatewayRouteUpdate.routes,
    ...GatewayRouteTrash.routes,
    ...GatewayRouteDelete.routes,
    ...GatewayRouteActivate.routes,
    ...GatewayRoutePing.routes,
    ...GatewayRouteDeactivate.routes,
    ...GatewayRouteList.routes,
    // configs
    ...GatewayConfigRoutesAllDomains.routes
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
        ...GatewayRouteTrash.controllers,
        ...GatewayRoutePing.controllers,
        ...GatewayRouteDeactivate.controllers,
        ...GatewayRouteList.controllers,
        // configs
        ...GatewayConfigRoutesAllDomains.controllers
    }
}