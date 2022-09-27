'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'GET',
    path: '/gateway/route/list',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayList'
})

controllers.DashboardGatewayList = async ({ request, response, next, helpers, config, plugins}) => {
    try {
        const { clientIds, sorts } = request.query
        const { GatewayRoutes } = plugins.mongoDBModels
        const { gatewayConfig } = config || {}
        let criteria = { routeStatus: 1 }
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds.split(',').map(x => x.trim()).filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        }
        let q = GatewayRoutes.find(criteria)
        if (sorts) {
            const sortdata = sorts.split(',').map(x => x.split(':').map(o => o.trim())).reduce((r, x) => {r[x[0]] = x[1]; return r}, {})
            q = q.sort(sortdata)
        }
        const data = await q
        response.send({
            code: 200,
            message: "Success",
            data: data.map(x => {
                x.routeStatus = gatewayConfig.statuses[x.routeStatus]
                return x
            })
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }