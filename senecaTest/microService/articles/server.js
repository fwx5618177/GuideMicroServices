const seneca = require('seneca')()
const Articles = require('./plugins/articles')

seneca.use(Articles)
.listen({
    port: 3003,
    type: 'http',
})
