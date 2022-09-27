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
        const { adminUser } = request.authInfo
        const { clientId, dataId } = request.body
        const { GatewayRoutes } = plugins.mongoDBModels
        const ObjectId = GatewayRoutes.base.mongoose.mongo.ObjectId
        const payloadData = {
            routeStatus: 0, // active
            updatedAt: new Date().getTime(),
            updatedBy: adminUser,
        }
        if (!clientId && !dataId) throw new Error('Required clientId or dataId')
        let criteria = {}
        if (clientId) criteria['clientId'] = clientId
        else criteria['_id'] = ObjectId(dataId)
        await GatewayRoutes.updateOne(criteria, { $set: payloadData })
        response.send({
            code: 200,
            message: "Success Deleted",
            data: payloadData
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }