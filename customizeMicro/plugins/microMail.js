const microMail = function(options) {
    /**
     * 发送邮件
     */
    this.add({channel: 'email', action: 'send'}, (msg, res) => {
        res(null, { ...msg })
    })


    /**
     * 获取邮件
     */
    this.add({channel: 'email', action: 'pending'}, (msg, res) => {
        res(null, {...msg})
    })

    /**
     * 信息标记为已读
     */
    this.add({channel: 'email', action: 'read'}, (msg, res) => {
        res(null, {...msg})
    })

}

module.exports = microMail