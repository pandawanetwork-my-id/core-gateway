'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'GET',
    path: '/gateway/config/domains',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayExtrasRoutes'
})

controllers.DashboardGatewayExtrasRoutes = async ({ response, next, plugins}) => {
    try {
        const { GatewayRoutes } = plugins.model.mongodb
        let criteria = { routeStatus: 1 }
        const data = await GatewayRoutes.find(criteria, { domain: 1, clientId: 1 })
        setTimeout(() => {
            response.send({
                code: 200,
                message: "Success",
                data
            })
        }, 3 * 1000)
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }