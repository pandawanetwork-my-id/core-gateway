'use strict'

const FormData = require('form-data')
const formidable = require('formidable')
const md5 = require('md5')
const fs = require('fs')
const axios = require('axios')
const lodashResult = require('lodash.result')

/* middlewares */
const jwt = require('./middlewares/jwt')
const gatewayMiddlewares = { 'jwt-auth': jwt }

const getMultipartBody = (request) => {
    return new Promise((resolve, reject) => {
        try {
            const form = new formidable.IncomingForm()
            form.parse(request, (err, body, filedata) => {
                if (err) return reject(err)
                if (filedata) {
                    const formdata = new FormData()
                    console.log('originalPath', filedata.file.filepath)
                    formdata.append('file', fs.createReadStream(filedata.file.filepath))
                    return resolve(formdata)
                }
                return resolve(body)
            })
        } catch (err) {
            console.log(err)
        }
    })
}

const sendRequest = async ({ method, baseURL, path, query, body, headers }, config) => {
    try {
        method = method.toLowerCase()
        let otherObjects = {}
        if (Object.keys(query).length > 0) otherObjects['params'] = query
        if (Object.keys(body).length > 0) otherObjects['data'] = body
        if (Object.keys(headers).length > 0) otherObjects['headers'] = headers
        delete otherObjects.headers.host
        delete otherObjects.headers['content-length']
        const initialConfig = {
            url: path,
            baseURL,
            method,
            ...otherObjects
        }
        let response = null
        console.log(JSON.stringify(initialConfig))
        response = await axios(initialConfig)
        const formattedResponse = {
            requestConfig: initialConfig,
            headers: response.headers,
            data: response.data,
            status: response.status,
            message: response.statusText
        }
        if (!config.developmentMode) {
            delete formattedResponse.requestConfig
            delete formattedResponse.headers
        }
        return formattedResponse
    } catch (err) {
        throw err
    }
}

const validateRequirements = (headers) => {
    const clientId = headers['x-client-id']
    const apiKey = headers['x-api-key']
    if (!clientId) throw new Error('Invalid Client Id: ' + (clientId || 'NOT-SET'))
    if (!apiKey) throw new Error('Invalid API Key Id: ' + (apiKey || 'NOT-SET'))
    return { clientId, apiKey }
}

const getRequestConfig = async (requestFromExpress, config={}, redisClient, helpers) => {
    try {
        const { GatewayPrefixPath } = config
        const { RouterGatewayHelper } = helpers
        const method = requestFromExpress.method
        const path = (requestFromExpress.path).replace(GatewayPrefixPath, '')
        const query = requestFromExpress.query
        let body = requestFromExpress.body
        let headers = requestFromExpress.headers
        let { clientId, apiKey: reqApiKey } = validateRequirements(headers)
        const routeName = [(method.toLowerCase()), path.replace(/\//g, '_')].join('')
        const clientAddress = RouterGatewayHelper().hashClient(clientId.toString())
        const cfg = await redisClient.get(clientAddress)
        console.log(cfg)
        if (!cfg) throw new Error(`Config Not Found For client: ('${clientId}')`)
        const {
            clientId: cId,
            httpScheme: scheme,
            domain,
            middlewares,
            apiKey
        } = JSON.parse(cfg)
        // validate if apiKey in Redis doesn't match with headers/reqApiKey
        if (apiKey !== reqApiKey) throw new Error('Api Key Doest\'n Match')
        const contentType = headers['content-type'] || 'application/json'
        headers['content-type'] = contentType
        if (contentType.indexOf('multipart/form-data') > -1) {
            body = await getMultipartBody(requestFromExpress)
            headers['content-type'] = 'multipart/form-data'
        }
        headers['r10-api-key'] = apiKey
        headers['r10-client-id'] = cId
        const baseURL = [scheme, domain].join('://')
        return {
            clientAddress,
            routeName,
            baseURL,
            method,
            path,
            query,
            body,
            headers,
            config: {
                cId,
                scheme,
                domain,
                apiKey,
                middlewares
            }
        }
    } catch (err) {
        throw err
    }
}
const handleNonAuth = async ({ routeName, method, path, query, body, headers }) => {
    try {
        return {
            routeName,
            method,
            path,
            query,
            body,
            headers,
            auth: false
        }
    } catch (err) {
        throw err
    }
}

const handle = async ({request: req, response: res, next, config, helpers, plugins}) => {
    try {
        const requestCtx = await getRequestConfig(req, config, plugins.model.redis, helpers)
        if (!requestCtx) {
            await next(new Error('Invalid Client Id'))
            return null
        }
        const { middlewares } = requestCtx.config
        for (const m of middlewares) {
            const middle = gatewayMiddlewares[m]
            if (typeof middle !== 'function') throw new Error('Invalid Middleware Named: ' + m)
            if (m === 'jwt-auth') {
                const projectIds = await middle({req, config, helpers, plugins, routeConfig: requestCtx.config})
                requestCtx.headers['r10-project-ids'] = projectIds
            } else 
                await middle({req, config, helpers, plugins, routeConfig: requestCtx.config})
        }
        const HttpResponse = await sendRequest(requestCtx, config)
        res.send(HttpResponse)
    } catch (err) {
        console.error(err)
        const errResData = lodashResult(err, 'response.data', err.message)
        const statusCode = lodashResult(errResData, 'status', 500)
        res.status(statusCode).send(errResData)
    }
}

module.exports = { handle, handleNonAuth }