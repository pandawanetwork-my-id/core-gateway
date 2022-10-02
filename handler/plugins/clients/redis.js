'use strict'

const redis = require('redis')

class RedisClient {
    constructor ({ dsn }) {
        this.dsn = dsn
    }

    async start () {
        try {
            console.log('Connecting Redis Client...')
            const rc = redis.createClient({ url: this.dsn })
            await rc.connect()
            if (this.events) {
                for (const e in this.events) {
                    rc.on(e, this.events[e])
                }
            }
            console.log('Redis Connected')
            rc.ping()
            return rc
        } catch (err) {
            throw err
        }
    }

    static get events () {
        return {
            error: (err) => {
                // send notice to developer
                console.log('Redis Error')
                console.log(err)
            }
        }
    }
}

module.exports = RedisClient