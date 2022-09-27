'use strict'

const FormData = require('form-data')
const formidable = require('formidable')
const Redis = require('redis')
const md5 = require('md5')
const fs = require('fs')
const axios = require('axios')

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

const sendRequest = async ({ method, baseURL, path, query, body, headers }) => {
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
        console.log(initialConfig)
        let response = null
        response = await axios(initialConfig)
        const formattedResponse = {
            requestConfig: initialConfig,
            headers: response.headers,
            data: response.data,
            status: response.status,
            message: response.statusText
        }
        return formattedResponse
    } catch (err) {
        throw err
    }
}

const getRequestConfig = async (requestFromExpress, GatewayPrefixPath, redisClient) => {
    try {
        const method = requestFromExpress.method
        const path = (requestFromExpress.path).replace(GatewayPrefixPath, '')
        const query = requestFromExpress.query
        let body = requestFromExpress.body
        let headers = requestFromExpress.headers
        const routeName = [(method.toLowerCase()), path.replace(/\//g, '_')].join('')
        const clientId = headers['x-client-id'] || null
        if (!clientId) throw new Error('Invalid Client Id: ' + clientId)
        const clientAddress = ['C', md5(clientId)].join('_').toUpperCase()
        const config = await redisClient.get(clientAddress)
        if (!config) throw new Error(`Invalid Config On Database (redis) For client: '${clientId}'`)
        const {client_id: cId, http_scheme: scheme, domain, middlewares} = JSON.parse(config)
        const contentType = headers['content-type']
        if (contentType.indexOf('multipart/form-data') > -1) {
            body = await getMultipartBody(requestFromExpress)
            headers['content-type'] = 'multipart/form-data'
        } else {
            headers['content-type'] = 'application/json'
        }
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

const handle = async ({request: req, response: res, next, helpers, plugins}) => {
    try {
        const requestCtx = await getRequestConfig(req, helpers.GatewayPrefixPath, plugins.redis)
        if (!requestCtx) {
            await next(new Error('Invalid Client Id'))
            return null
        }
        console.log(requestCtx)
        const HttpResponse = await sendRequest(requestCtx)
        console.log('request done')
        res.send(HttpResponse)
    } catch (err) {
        next(err)
    }
}

module.exports = { handle, handleNonAuth }