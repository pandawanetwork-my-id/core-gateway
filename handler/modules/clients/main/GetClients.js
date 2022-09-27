'use strict'

let controllers = {}
let routes = []

routes.push({
    method: 'get',
    path: '/list',
    middlewares: [],
    controller: 'GetClients'
})

controllers.GetClients = async ({request: req, response: res, next, helpers, config, plugins}) => {
    try {
        const { search, q, keys, sorts, limit, page } = req.query || {}
        const { RippleClients } = plugins.model.mysql
        const { operators } = RippleClients
        let opts = {}
        opts['attributes'] = ['client_id', 'client_name']
        if (keys) {
            const validKeys = RippleClients.validateFields(keys.split(',').map(x => x.trim()))
            opts['attributes'] = validKeys
        }
        if (sorts) {
            const sortData = sorts.split(',')
                .map(x => {
                    const sortPattern = x.split(':')
                    const sort = [sortPattern[0], sortPattern[1] || 'asc']
                    return sort
                })
            opts['order'] = sortData
        }
        if (search || q) {
            opts['where'] = {
                'client_name': {
                    [operators.like]: `%${search || q}%`
                }
            }
        }
        opts['limit'] = 10
        opts['offset'] = 0
        if (limit) {
            const updateLimit = parseInt(limit)
            if (updateLimit > 0) opts['limit'] = updateLimit
        }
        if (page) {
            const updatePage = parseInt(page) -1
            if (updatePage > 0) opts['offset'] = (updatePage * opts.limit) + 1
        }
        const data = await RippleClients.findAll(opts)
        const meta = {
            count: data.length
        }
        res.send({
            code: 200,
            message: 'Success',
            data,
            meta
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    controllers,
    routes
}