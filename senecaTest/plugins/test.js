/**
 * 测试各个微服务
 */

const Config = require('../config/config')
const ServiceList = Config.ServiceList

/**
 * 测试各个微服务
 */
const test = function(options) {
    this.add('service:test, path:ping', (msg, res) => {
        const service = msg.args.params.service
        const data = msg.args.query.data

        if (!ServiceList[service]) {
            res(new Error('service is not access:' + service + ', ' + ServiceList[service]), null)
            return 
        }

        this.act(`service:${service}, cmd:ping`, { service, data }, (err, data, meta) => {
            if(err) console.error(err)
            console.log(data)

            return res(err, data, meta)
        })
    })

    this.add('init:test', (msg, res) => {
        this.act('role:web', {routes: {
            prefix: '/test',
            pin: 'service:test,path:*',
            map: {
                ping: {
                    GET: true,
                    suffix: '/:service'
                }
            }
        }}, res)
    })
}

module.exports = test
