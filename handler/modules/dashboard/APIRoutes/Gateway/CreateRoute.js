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
        const { clientId, httpScheme, domain, apiKey } = request.body
        const { GatewayRoutes } = plugins.mongoDBModels
        const payloadData = {
            clientId,
            httpScheme,
            domain,
            middlewares: [],
            apiKey,
            routeStatus: 1, // active
            createdAt: new Date().getTime(),
            createdBy: adminUser,
            updatedAt: null,
            updatedBy: null,
        }
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