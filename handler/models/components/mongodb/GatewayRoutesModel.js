const schema = {
    clientId: String,
    httpScheme: String,
    domain: String,
    middlewares: [],
    apiKey: String,
    routeStatus: String,
    createdAt: Number, // uniqTime
    createdBy: String,
    updatedAt: Number, // uniqTime
    updatedBy: String,
    lastActivateAt: Number,
    lastActivateBy: String,
    lastDeactivateAt: Number,
    lastDeactivateBy: String,
}

const options = {} // see https://mongoosejs.com/docs/connections.html#options

const indexes = [
    {
        index: {clientId: 1},
        options: {uniq: true}
    },
    {
        index: {createdAt: -1},
        options: {}
    }
]

module.exports = {
    schema,
    options,
    indexes
}