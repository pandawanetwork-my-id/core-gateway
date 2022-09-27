'use strict'

let routes = []
let controllers = {}

routes.push({
    method: 'POST',
    path: '/auth/login',
    middlewares: [],
    controller: 'DashboardLogin'
})
// await AdminAccounts.create({
//     username: 'rohmanahmad',
//     email: 'rohmanahmad@ico.co',
//     password: 'punt3n123',
//     phoneNumber: '08222122928988',
//     userStatus: 1, // 1 = active
//     createdAt: new Date().getTime(),
// })
controllers.DashboardLogin = async ({request, response, next, helpers, config, plugins}) => {
    try {
        const { crypto } = helpers
        const { AppKey, SessionExpires } = config
        const { AdminAccounts } = plugins.mongoDBModels
        const { jwt } = config.dependencies
        const { username, email, password } = request.body
        const decryptedPass = await crypto.decrypt(password)
        const accountData = await AdminAccounts.findOne({$or: [{username}, {email}], password: decryptedPass})
        if (accountData) {
            response.send({
                code: 200,
                message: "Success Login",
                data: {
                    token: jwt.sign({
                        adminUser: username
                    }, AppKey, { expiresIn: SessionExpires })
                }
            })
        } else {
            throw new Error('Invalid Username or Password!')
        }
    } catch (err) {
        next(err)
    }
}

module.exports = { routes, controllers }