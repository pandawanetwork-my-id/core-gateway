'use strict'

let controllers = {}
let routes = []

const deactivateRoute = async function (routesData={}) {
    const { md5, redis, adminUser } = this
    for (const route of routesData) {
        const r = route.toJSON()
        const cId = r.clientId
        const domain = r.domain
        const hashClient = ['C', md5(cId)].join('_').toUpperCase()
        const jsonData = JSON.stringify({
            clientId: cId,
            httpScheme: r.httpScheme,
            domain,
            middlewares: r.middlewares
        })
        console.log('Removing routes:', `[${adminUser}] [client: ${cId}]`,hashClient, '<< To >>',  domain)
        redis.del(hashClient)
    }
}

routes.push({
    method: 'POST',
    path: '/gateway/route/deactivate',
    middlewares: [
        'dashboard-auth'
    ],
    controller: 'DashboardGatewayDeactivate'
})

controllers.DashboardGatewayDeactivate = async ({ request, response, next, config, helpers, plugins}) => {
    try {
        const { md5 } = config.dependencies
        const { redis } = plugins
        const { adminUser } = request.authInfo
        const { clientIds } = request.body
        const { GatewayRoutes } = plugins.mongoDBModels
        let criteria = { routeStatus: 1 }
        if (clientIds && clientIds.length > 0) {
            const clientsIdArray = clientIds.split(',').map(x => x.trim()).filter(x => x.length > 0)
            criteria['clientId'] = {
                $in: clientsIdArray
            }
        }
        const data = await GatewayRoutes.find(criteria)
        const startDeactivate = deactivateRoute.bind({ adminUser, redis, md5 })
        if (data) await startDeactivate(data)
        await GatewayRoutes.updateMany(criteria, { $set: { lastDeactivateBy: adminUser, lastDeactivateAt: new Date().getTime() } })
        setTimeout(() => {
            response.send({
                code: 200,
                message: "Success Deactivated"
            })
        }, 3 * 1000)
    } catch (err) {
        next(err)
    }
}

module.exports = { controllers, routes }