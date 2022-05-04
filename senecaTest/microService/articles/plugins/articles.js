const Articles = function(options) {
    this.add({
        service: 'articles',
        cmd: 'ping'
    }, (msg, res) => {
        console.log('>>>>>>>>Articles received!')

        res(null, {
            response: ' micro service articles: reponse, ',
            data: msg.data + ',',
        })
    })
    
}

module.exports = Articles
