'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/trash',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayTrash'
})

controllers.DashboardGatewayTrash = async ({ request, response, next, helpers, plugins}) => {
    try {
        // const { adminUser } = request.authInfo
        const { clientId, dataId } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        const ObjectId = GatewayRoutes.base.mongoose.mongo.ObjectId
        if (!clientId && !dataId) throw new Error('Required clientId or dataId')
        let criteria = {}
        if (clientId) criteria['clientId'] = clientId
        else criteria['_id'] = ObjectId(dataId)
        await GatewayRoutes.updateOne(criteria, {$set: { routeStatus: -1 }})
        response.send({
            code: 200,
            message: "Success Move to Trash"
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }