'use strict'

const md5 = require('md5')

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/activate',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayActivate'
})

controllers.DashboardGatewayActivate = async ({ request, response, next, config, helpers, plugins}) => {
    try {
        const { RouterGatewayHelper } = helpers
        const { redis } = plugins.model
        const { adminUser } = request.authInfo
        const { clientIds } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        let criteria = { routeStatus: 1 }
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds.split(',').map(x => x.trim()).filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        }
        const data = await GatewayRoutes.find(criteria)
        if (data) {
            RouterGatewayHelper({dependencies: {redis, md5}, adminUser})
                .activate(data)
        }
        await GatewayRoutes.updateMany(criteria, { $set: { lastActivateBy: adminUser, lastActivateAt: new Date().getTime() } })
        setTimeout(() => {
            response.send({
                code: 200,
                message: "Success Activated"
            })
        }, 3 * 1000)
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }