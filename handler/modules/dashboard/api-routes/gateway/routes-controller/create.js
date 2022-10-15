'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/add',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayCreate'
})

controllers.DashboardGatewayCreate = async ({ request, response, next, helpers, plugins}) => {
    try {
        const { adminUser } = request.authInfo
        const { clientId, httpScheme, domain, apiKey, middlewares='' } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        const payloadData = {
            clientId,
            httpScheme,
            domain,
            middlewares: [],
            apiKey,
            routeStatus: 0, // default in-active
            createdAt: new Date().getTime(),
            createdBy: adminUser,
            updatedAt: null,
            updatedBy: null,
        }
        if (middlewares) payloadData.middlewares = middlewares.split(',').map(x => x.trim())
        // check existing route with this clientid
        const isExistingRoute = await GatewayRoutes.findOne({ clientId })
        if (isExistingRoute) throw new Error('Client Route Already Exists!')
        const x = await GatewayRoutes.create(payloadData)
        response.send({
            code: 200,
            message: "success",
            data: x.toJSON()
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }