module.exports = {
    "rate-limit": require('./components/rate-limit'),
    "auth:jwt": require('./components/auth/jwt'),
    "auth:basic": require('./components/auth/basic'),
    "dashboard-auth": require('./components/auth/jtw-dashboard')
}