'use strict'

const md5 = require('md5')

let controllers = {}
let routes = []

routes.push({
    method: 'POST',
    path: '/gateway/route/ping',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayPing'
})

controllers.DashboardGatewayPing = async ({ request, response, next, config, helpers, plugins}) => {
    try {
        const { RouterGatewayHelper } = helpers
        const { redis } = plugins.model
        const { adminUser } = request.authInfo
        const { dataId } = request.body
        const { GatewayRoutes } = plugins.model.mongodb
        const ObjectId = GatewayRoutes.base.mongoose.mongo.ObjectId
        let criteria = { }
        if (dataId) {
            criteria['_id'] = ObjectId(dataId)
        } else throw new Error('Invalid Route Id')
        const data = await GatewayRoutes.find(criteria)
        if (!data) throw new Error('No Route Found')
        const item = data.toJSON()
        // run request ping to each route domain
        setTimeout(() => {
            response.send({
                code: 200,
                message: item
            })
        }, 3 * 1000)
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }