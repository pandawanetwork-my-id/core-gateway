const schema = {
    username: String,
    email: String,
    password: String,
    phoneNumber: String,
    userStatus: String,
    createdAt: Number, // uniqTime
    passwordChangesLog: [
        {
            oldPasswod: String,
            newPassword: String,
            updatedAt: Number,
        }
    ]
}

const options = {} // see https://mongoosejs.com/docs/connections.html#options

const indexes = [
    {
        index: {username: 1},
        options: {uniq: true}
    },
    {
        index: {email: 1},
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