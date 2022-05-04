const seneca = require('seneca')()
const Roles = require('./plugins/roles')

seneca.use(Roles)
.listen({
    port: 3002,
    type: 'http',
})
