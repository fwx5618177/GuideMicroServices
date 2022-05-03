const smsMicro = function(options) {
    /**
     * 发送短信
     */
    this.add({channel: 'sms', action: 'send'}, (msg, res) => {
        res(null, {...msg})
    })

    /**
     * 获取未读短信
     */
    this.add({channel:'sms', action:'pending'}, (msg, res) => {
        res(null, {...msg})
    })

}


module.exports = smsMicro
