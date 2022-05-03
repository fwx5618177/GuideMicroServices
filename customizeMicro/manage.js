const Manage = function (options) {

    this.add({ role: 'employee', cmd: 'add' }, (msg, res) => {
        this.make('employee').data$(msg.data).save$(res)
    })

    this.find({ role: 'employee', cmd: 'get' }, (msg, res) => {
        this.make('employee').load$(msg.id, res)
    })
}

const seneca = require('seneca')().use('employees-storage')

const employee = {
    name: 'fwx',
    surname: 'fwx',
    position: 'se',
}

const add_employee = function() {
    seneca.act({role: 'employee', cmd: 'add', data: employee}, (err, msg) => {
        console.log(msg);
    })
}

add_employee()