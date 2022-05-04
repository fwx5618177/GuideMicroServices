const seneca = require('seneca')()
const users = require('./plugins/users')

seneca.use(users)
.listen({
    port: 3001,
    type: 'http',
})
