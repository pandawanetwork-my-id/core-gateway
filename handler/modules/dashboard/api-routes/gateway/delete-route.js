'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/delete',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayDelete'
})

controllers.DashboardGatewayDelete = async ({ request, response, next, helpers, plugins}) => {
    try {
        // const { adminUser } = request.authInfo
        const { clientId, dataId } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        const ObjectId = GatewayRoutes.base.mongoose.mongo.ObjectId
        if (!clientId && !dataId) throw new Error('Required clientId or dataId')
        let criteria = {}
        if (clientId) criteria['clientId'] = clientId
        else criteria['_id'] = ObjectId(dataId)
        await GatewayRoutes.deleteOne(criteria)
        response.send({
            code: 200,
            message: "Success Deleted"
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }