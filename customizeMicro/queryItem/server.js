const plugin = require('./items')
const express = require('express')
const seneca = require('seneca')()
const Web = require("seneca-web");
const adapter = require('seneca-web-adapter-express');

const app = express()

seneca.use(plugin);

seneca.use(Web, { adapter: adapter, context: app })

// seneca.use('basic').use('entity')
seneca.use('mongo-store', {
    // name: 'seneca',
    // host: '127.0.0.1',
    // port: '27017',
    uri: 'mongodb://root:pass12345@localhost:27017'
})

// seneca.add({"role": "product", "cmd": "create"}, (args, done) => {  
//     var product = seneca.make$("Product");
//     product.name = args.name;
//     product.description = args.description;
//     product.price = args.price;
//     product.save$((err, savedProduct) => {
//       done(err, savedProduct);
//     });
// });

seneca.act('role:web', {routes: {
    prefix: '/products',
    // pin: { area: 'product', action: '*' },
    pin: "area:product,action:*",
    map: {
        fetch: {GET:true},
        edit: {GET:false, POST:true},
        delete: {GET:false, DELETE: true}
    }
}});

seneca.ready(err => {
    app.use(require('body-parser').json())

    // screen.act({"role": "product", "cmd": "create"})
    // app.use()
    const appI = seneca.export('web/context')()

    appI.listen(3000)
})