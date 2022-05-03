const cluster = require('cluster')
const http = require('http')
const cpus = require('os').cpus().length


console.log('cpus:', cpus);
console.log('http://localhost:80');
// 确认本进程是否是集群的master，根进程需要fork出所有执行web服务的子进程
if(cluster.isMaster) {
    for (let i = 0; i < cpus; i++) cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        console.log("worker:" + worker.process.pid + " has finished.");
    })
    
} else {
    // 如果是子进程，就会执行web
    http.createServer((req, res) => {
        res.writeHead(200)
        res.end('Here we are!\n')
    }).listen(80, () => {
        console.log(`started process`, process.pid);
    })
}

