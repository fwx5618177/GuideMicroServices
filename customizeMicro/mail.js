const mail = function(options) {

    const init = []

    /**
     * 发送短信
     */
    init.sendSMS = (dest, content) => {}

    /**
     * 读取未读短信列表
     */
    init.readPendingSMS = () => {

        return listOfSms;
    }

    /**
     * 发送邮件
     */
    init.sendMail = (subject, content) => {}


return init
}

const microMail = require('./plugins/microMail')
const smsMicro = require('./plugins/smsMicro')
const postMicro = require('./plugins/postMicro')

const seneca = require('seneca')()
    .use('microMail')
    .use('smsMicro')
    .use('postMicro')

console.log('http://10.0.0.7:1932');
seneca.listen({ port: 1932, host: '10.0.0.7' })

const senecaEmail = require("seneca").client({
    host: 'new-email-service-ip',
    port: 1932
})

