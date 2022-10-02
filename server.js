require('dotenv').config({})
// const Server = require('../core-server')
const Server = require('rohmanwebid-core-server')
const helpers = require('./handler/helpers')
const PluginAdapter = require('./handler/plugins/adapter')

const { routes, controllers, middlewares, globalMiddlewares } = require('./handler')
const configs = require('./config')
const { AppHost, AppPort } = configs

const mongodbModels = require('./handler/models/mongodb')
const mysqlModels = require('./handler/models/mysql')
const pluginObject = new PluginAdapter(configs)
    .setModel('mongodb', mongodbModels)
    .setModel('redis')
    .setModel('mysql', mysqlModels)

const createServer = async () => {
    try {
        const HttpServer = new Server({})
        HttpServer.setObject('routes', routes)
        HttpServer.setObject('controllers', controllers)
        HttpServer.setObject('globalMiddlewares', globalMiddlewares)
        HttpServer.setObject('middlewares', middlewares)
        HttpServer.setObject('config', configs)
        HttpServer.setObject('plugins', await pluginObject.setup() )
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
