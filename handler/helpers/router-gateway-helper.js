'use strict'

class RouterGatewayHelper {
    constructor ({dependencies, adminUser}) {
        this.dependencies = dependencies
        this.adminUser = adminUser
    }

    activate (routesData) {
        const { md5, redis } = this.dependencies
        const adminUser = this.adminUser
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
            console.log('Setting Up routes:', `[admin: ${adminUser}] [client: ${cId}]`,hashClient, '<< To >>',  domain)
            redis.set(hashClient, jsonData)
        }
    }

    deactivate (routesData) {
        const { md5, redis } = this.dependencies
        const adminUser = this.adminUser
        for (const route of routesData) {
            const r = route.toJSON()
            const cId = r.clientId
            const domain = r.domain
            const hashClient = ['C', md5(cId)].join('_').toUpperCase()
            console.log('Removing routes:', `[${adminUser}] [client: ${cId}]`,hashClient, '<< To >>',  domain)
            redis.del(hashClient)
        }
    }

    reactivate (routesData) {
        this.deactivate(routesData)
        this.activate(routesData)
    }
}

module.exports = (config={}) => {
    return new RouterGatewayHelper(config)
}