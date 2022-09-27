'use strict'

const redis = require('redis')

class RedisClient {
    constructor ({ dsn }) {
        this.dsn = dsn
    }

    async start () {
        const rc = redis.createClient({ url: this.dsn })
        await rc.connect()
        if (this.events) {
            for (const e in this.events) {
                rc.on(e, this.events[e])
            }
        }
        return rc
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