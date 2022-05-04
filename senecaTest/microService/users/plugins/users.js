const users = function(options) {
    this.add({
        service: 'users',
        cmd: 'ping'
    }, (msg, res) => {
        console.log('>>>>>>>>Users received!')

        res(null, {
            response: ' micro service users: reponse, ',
            data: msg.data + ',',
        })
    })
}

module.exports = users
