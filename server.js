require('dotenv').config({})
const Server = require('../core-server')
const Redis = require('redis')
const Mongodb = require('../my-libraries/mongodb')
const mongodbModelsConfig = require('./handler/models/mongodb')
const mysqlModelsConfig = require('./handler/models/mysql')
const Mysql = require('../my-libraries/mysql')
const crypto = require('./handler/helpers/crypto')

const { routes, controllers, middlewares, globalMiddlewares } = require('./handler')
const configs = require('./config')
const { AppHost, AppPort, RedisDSN, MongodbDSN, mysqlConnection={} } = configs

const redisClient = Redis.createClient({ url: RedisDSN })
const mongodbClient = new Mongodb({dsn: MongodbDSN, models: mongodbModelsConfig, connectionOptions: {}})
const mysqlClient = new Mysql(mysqlConnection)

redisClient.on('error', (err) => {
    // send notice to developer
    console.log('REdis Error')
    console.log(err)
})

const createServer = async () => {
    try {
        await redisClient.connect()
        const mongoDBModels = mongodbClient.start()
        const mysqlModels = await mysqlClient.start(mysqlModelsConfig)
        const plugins = { redis: redisClient, mongoDBModels, mysqlModels }
        const helpers = { crypto }
        const HttpServer = new Server({})
        HttpServer.setObject('routes', routes)
        HttpServer.setObject('controllers', controllers)
        HttpServer.setObject('globalMiddlewares', globalMiddlewares)
        HttpServer.setObject('middlewares', middlewares)
        HttpServer.setObject('config', configs)
        HttpServer.setObject('plugins', plugins)
        HttpServer.setObject('helpers', helpers)
        HttpServer.start({
            port: AppPort,
            host: AppHost
        }, (msg) => {
            console.log(msg)
        })
    } catch (err) {
        throw err
    }
}


createServer()
    .catch(err => {
        console.log(err)
        process.exit(0)
    })
