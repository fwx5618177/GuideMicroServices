const postMicro = function(options) {
    /**
     * 待打印、邮寄的信息放入队列
     */
    this.add({channel: 'post', action: 'queue'}, (msg, res) => {
        res(null, {...msg})
    })

}

module.exports = postMicro