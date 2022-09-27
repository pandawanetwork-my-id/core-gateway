const clients = {
    MongodbClient: require('./clients/mongodb'),
    MysqlClient: require('./clients/mysql'),
    RedisClient: require('./clients/redis')
}

class PluginAdapter {
    constructor(config) {
        this.config = config
        this.model = {}
    }

    setModel(connectionType, modelComponents) {
        let client = null
        switch (connectionType) {
            case 'mysql':
                client = new clients.MysqlClient({ dsn: this.config.mysqlConnection.dsn, models: modelComponents })
                break;
            case 'mongodb':
                client = new clients.MongodbClient({ dsn: this.config.MongodbDSN, models: modelComponents })
                break;
            case 'redis':
                client = new clients.RedisClient({ dsn: this.config.RedisDSN })
                break;
            default:
                throw new Error(`Invalid Model Type With Name ${connectionType}`)
        }
        this.model[connectionType] = client
        return this
    }

    async setup () {
        if (this.model) {
            for(const connectionType in this.model) {
                const m = this.model[connectionType]
                this.model[connectionType] = await m.start()
            }
        }
        return this
    }
}

module.exports = PluginAdapter