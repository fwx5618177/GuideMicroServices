
const seneca = require('seneca')()

const plugin = function(options) {
    const seneca = this

    
/**
 * 获取所有商品列表
 */
seneca.add({area: 'product', action: 'fetch'}, (args, done) => {
    const product = this.make$("products");

    product.list$({}, (err, result) => {
        done(err, result)
    });
})

/**
 * 获取指定类别的商品列表
 */
seneca.add({area: 'product', action: 'fetch', criteria: 'byCategory'}, (args, done) => {
    const products = this.make("products");

    products.list$({category: args.category}, (err, result) => {
        done(err, result)
    })
})

/**
 * ID query
 */
seneca.add({area: 'product', action: 'fetch', criteria: 'byId'}, (args, done) => {
    const product = this.make("products")

    product.load$(args.id, (err, result) => {
        done(err, result)
    })
})


/**
 * ADD
 */
seneca.add({area: 'product', action: 'add'}, (args, done) => {
    const products = this.make("products")

    products.category = args.category
    products.name = args.name
    products.description = args.description
    products.price = args.price

    products.save$((err, product) => {
        done(err, products.data$(false))
    })
})

/**
 * del by id
 */

seneca.add({area: 'product', action: 'remove'}, (args, done) => {
    const product = this.make('products')

    product.remove$(args.id, (err, res) => {
        done(err, res)
    })
})

/**
 * edite by id
 */
seneca.add({area: 'product', action: 'edit'}, (args, done) => {
    seneca.act({area: 'product', action: 'fetch', criteria: 'byId', id: args.id}, (err, result) => {
        result.data$(
            {
                name: args.name,
                category: args.category,
                description: args.description,
                price: args.price,
            }
        );

        result.save$((err, product) => {
            done(product.data$(false))
        })
    })
})
}

module.exports = plugin;

