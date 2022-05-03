const http = require('http');

const port = 8000;
const url = `http://localhost:${port}/`

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("Hello microservice");
})

console.log(url);
server.listen(port);