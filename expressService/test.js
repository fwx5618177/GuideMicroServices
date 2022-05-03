'use strict'

const seneca = require('seneca')();

seneca.add(
    {
        role: 'math',
        cmd: 'sum',
    },
    (msg, respond) => {
        let sum = msg.left + msg.right

        respond(null, {answer: sum, role: 'fwx'})
    }
)

seneca.act({ role: 'math', cmd: 'sum', left: 1, right: 2 }, (err, data) => {
    console.log(data)
})

const myPlugin = (option) => {

    this.add({ role: 'math', cmd: 'sum' }, (msg, respond) => {
        respond(null, { answer: msg.left + msg.right })
    })

}

seneca.use('./plugins/myPlugin').act('role: math, cmd: sum, left: 1, right: 2', console.log)

