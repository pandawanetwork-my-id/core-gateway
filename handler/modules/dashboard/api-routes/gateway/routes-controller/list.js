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
        const { clientIds, httpScheme, domain, routeStatus, sorts } = request.query
        const { GatewayRoutes } = plugins.model.mongodb
        const { gatewayConfig } = config || {}
        let criteria = { }
        if (routeStatus && routeStatus.length > 0) criteria['routeStatus'] = routeStatus
        if (httpScheme && httpScheme.length > 0) criteria['httpScheme'] = httpScheme
        if (domain && domain.length > 0) criteria['domain'] = domain
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds
                .split(',')
                .map(x => x.trim())
                .filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        }
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds
                .split(',')
                .map(x => x.trim())
                .filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        }
        let q = GatewayRoutes.find(criteria)
        if (sorts) {
            const sortdata = sorts
                .split(',')
                .map(x => x.split(':').map(o => o.trim()))
                .reduce((r, x) => {r[x[0]] = x[1]; return r}, {})
            q = q.sort(sortdata)
        }
        let data = await q
        data = data.map(x => {
            x = x.toJSON()
            x.routeStatusText = gatewayConfig.statuses[x.routeStatus]
            x.actions = []
            if (x.routeStatus == 0) { // in-active
                x.actions.push('edit')
                x.actions.push('activate')
                x.actions.push('trash')
            } else if (x.routeStatus == 1) {
                x.actions.push('deactivate')
                x.actions.push('ping')
            } else {
                x.actions.push('edit')
                x.actions.push('delete')
            }
            return x
        })
        response.send({
            code: 200,
            message: "Success",
            data
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }