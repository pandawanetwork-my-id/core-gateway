'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/update',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayUpdate'
})

controllers.DashboardGatewayUpdate = async ({ request, response, next, helpers, plugins}) => {
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
            updatedAt: new Date().getTime(),
            updatedBy: adminUser,
        }
        await GatewayRoutes.updateOne({ clientId }, { $set: payloadData })
        response.send({
            code: 200,
            message: "Success Updated",
            data: payloadData
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }