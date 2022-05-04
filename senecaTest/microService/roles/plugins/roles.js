const Roles = function(options) {
    this.add({service: 'roles', cmd: 'ping'}, (msg, res) => {
        console.log('>>>>>>>>Roles received!')

        res(null, {
            response: ' micro service roles: reponse, ',
            data: msg.data + ',',
        })
    })
}

module.exports = Roles
