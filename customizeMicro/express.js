const seneca = require('seneca')();
const web = require('seneca-web');
const adapter = require('seneca-web-adapter-express');
const express = require('express');

const app = express();

seneca.use(web, {
    context: app,
    adapter: adapter,
})

seneca.add('role:api,cmd:fwx', (args, done) => {
    done(null, { bar: 'bazinga' })
})

seneca.act('role:web', {
    routes: {
        prefix: '/test',
        pin: "role:api,cmd:*",
        map: {
            fwx: { GET: true }
        }
    }
})

seneca.ready(() => {
    const appI = seneca.export('web/context')();
    appI.listen(3000)
})


console.log('http://localhost:3000');
