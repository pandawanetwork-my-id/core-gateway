'use strict'

let controllers = {}
let routes = []

const activateRoute = async function (routesData={}) {
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
        console.log('Setting Up routes:', `[client: ${cId}]`,hashClient, '<< To >>',  domain)
        redis.set(hashClient, jsonData)
    }
}

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
        const startActivate = activateRoute.bind({ redis, md5, adminUser })
        if (data) await startActivate(data)
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