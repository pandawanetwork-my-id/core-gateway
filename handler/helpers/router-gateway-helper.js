'use strict'

const md5 = require('md5')

class RouterGatewayHelper {
    constructor ({dependencies, adminUser}) {
        this.dependencies = dependencies
        this.adminUser = adminUser
    }

    hashClient(cId) {
        return ['C', md5(cId)].join('_').toUpperCase()
    }

    activate (routesData) {
        const { redis } = this.dependencies
        const adminUser = this.adminUser
        for (const route of routesData) {
            const r = route.toJSON()
            const cId = r.clientId
            const domain = r.domain
            const apiKey = r.apiKey
            const hashClient = this.hashClient(cId)
            const jsonData = JSON.stringify({
                clientId: cId,
                httpScheme: r.httpScheme,
                domain,
                apiKey,
                middlewares: r.middlewares
            })
            console.log('Setting Up routes:', `[admin: ${adminUser}] [client: ${cId}]`,hashClient, '<< To >>',  domain)
            redis.set(hashClient, jsonData)
        }
    }

    deactivate (routesData) {
        const { redis } = this.dependencies
        const adminUser = this.adminUser
        for (const route of routesData) {
            const r = route.toJSON()
            const cId = r.clientId
            const domain = r.domain
            const hashClient = this.hashClient(cId)
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