const seneca = require('seneca')();

seneca.add({
    role: 'math',
    cmd: 'sum',
}, (msg, res) => {
    const sum = msg.left + msg.right

    res(null, { answer: sum })
})

seneca.add({ role: 'math', cmd: 'product' }, (msg, res) => {
    const product = msg.left * msg.right

    res(null, { answer: product })
})

seneca.act({
    role: 'math',
    cmd: 'sum',
    left: 1,
    right: 2,
}, (err, data) => {
    if (err) return console.error(err);

    console.log(data);
})

seneca.act({
    role: 'math',
    cmd: 'product',
    left: 3,
    right: 4,
}, console.log)

seneca.add({ component: 'greeter' }, (msg, res) => {
    res(null, { message: 'Hello' + msg.name })
})

seneca.act({ component: 'greeter', name: 'David' }, (err, data) => {
    if(err) console.error(err);

    console.log(data);
})

// count character
seneca.add({ cmd: 'wordCount' }, (msg, res) => {
    const length = msg.phrase.split(' ').length

    res(null, { words: length })
})

seneca.add({ cmd: 'wordCount' }, (msg, res) => {
    const words = msg.phrase.split(' ');

    let count;

    for (let i of words) {
        if(i.length > 3) count++
    }

    res(null, { words: count })
})

seneca.act({ cmd: 'wordCount', phrase: 'Hello World this is Seneca' }, (err, data) => {
    console.log(data);
})

const init = function(msg, res) {
    console.log('Initial');
    res()
}

const minimal_Plugin = function(option) {
    // console.log(option);
    this.add({ role: 'math', cmd: 'sum' }, (msg, res) => {
        res(null, {answer: msg.left + msg.right})
    })

    this.add({ init: 'minimal_Plugin'}, init)
}

seneca.use(minimal_Plugin)
.act('role:math, cmd: sum, left:1, right:2', console.log)