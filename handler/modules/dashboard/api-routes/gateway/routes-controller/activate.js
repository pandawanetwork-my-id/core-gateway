'use strict'

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
        const { clientIds, dataId } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        const ObjectId = GatewayRoutes.base.mongoose.mongo.ObjectId
        let criteria = { }
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds.split(',').map(x => x.trim()).filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        } else if (dataId) {
            criteria['_id'] = ObjectId(dataId)
        } else throw new Error('Invalid Data ID')
        const data = await GatewayRoutes.find(criteria)
        if (data) {
            RouterGatewayHelper({dependencies: { redis }, adminUser})
                .activate(data)
        }
        await GatewayRoutes.updateMany(criteria, { $set: { lastActivateBy: adminUser, lastActivateAt: new Date().getTime(), routeStatus: 1 } })
        setTimeout(() => {
            response.send({
                code: 200,
                message: "Route Activated"
            })
        }, 3 * 1000)
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }