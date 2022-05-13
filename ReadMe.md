目录
[TOC]

# ScNode微服务
- [x] seneca
- [x] http -> RPC
- [x] 部署
- [x] DB
- [x] [smf-开箱即用的seneca微服务](https://zhuanlan.zhihu.com/p/111076994)

技术栈：
- Seneca 微服务
- PM2: 部署和日志查看
- TDD Mocha， Chai
- Mock: Sinon
- DOC: Swagger
- 监控服务 Keymetrics, NewRelic
- 部署: PM2 + dockerfile
- 同类推荐: [Moleculer](https://moleculer.services/)
- 开箱即用的: [smf](https://github.com/krawa76/smf)

# 具体内容
1. 微服务概念
2. Seneca, PM2
3. 单块应用分解成微服务程序
4. 微服务程序
5. 安全性和可追溯性
6. 测试框架-Mocha, Chai,Sinon用于mock服务，swagger微服务文档化
7. PM2结合Keymetrics监控微服务
8. 部署

# 微服务架构
微服务：
- 自治单元，不干涉系统的其他部分
- 弹性、可组合性、灵活性
- 缺点：
    - 延迟：微服务具有分布式的特性，从而会存在延迟
    - 可追踪性
    - 配置管理问题
    - 最终一致性：事务性要求较高的系统中，实现的局限性里，各个节点在某一段时间内可能出现数据不一致

拆分微服务：
- 专职化（specialization）
- 邮件发送
- 支付卡交易

智能服务、通信管理：
- BPEL：业务流程执行语言(Business Process Execution Language)，围绕业务环节的衔接行为，而非通信行为本身
- HTTP / RPC 构建面向微服务的最广泛协议
- 队列简化端点之间的通信：Rabbit MQ， Kafka
    - 队列技术以缓冲的形式提供了管理通信的全新形式，对高度事务性系统中消息确认机制的复杂性做了封装

微服务去中心化：便于构建超大的数据库

数据库设计的ACID原则：
- 原子性
- 一致性
- 隔离性
- 持久性

微服务技术多样化

微服务部署：
- 简单部署
- docker部署

微服务和SOA（面向服务架构）的区别
- SOA：面向服务架构，所有组件独立自主，并为其他组件提供服务，不能替换系统中的某些部分
- 微服务：细粒度的SOA组件，单个SOA组件拆分成微服务，微服务通过分工协助实现SOA
- 另一处不同是：服务互联和编写服务时采用的技术
- 微服务可以采用不同的语言来构建服务
- 领域模型：
    - 每个微服务在本地存储自身管理的数据，并将领域模型分别隔离到单个服务中
    - 面向SOA中，数据往往存在单个大型的数据库中，服务之间会共享领域模型

Node的有点：
- 测试友好
- 易于部署
- npm管理依赖
- 主流标准协议相集成的库

Sceneca：
- API聚合：将不同功能（插件、方法等）组合成一个接口的高级技术


# Seneca、PM2构建微服务
- 整合Seneca、Express
- PM2

优势：
- 服务器需要非阻塞特性（websocket）
- 应用：restify，express
- 运行应用: forever, nodemon
- 部署：pm2
- 环境配置：Chef / puppet / ansible

环境安装：
- npm i -S seneca
- npm i -g pm2

Node线程模型：
- Node编写的程序都是单线程的，如果处理上万个并发请求，会进入等待队列，顺序得被node的事件轮询机制处理
- Node是异步处理机制，在处理慢的事件时，不会阻塞线程，会继续处理其他事件
- 此模型存在回调地狱

DAO：数据访问对象

SOLID设计原则：
- 模块包含越多的函数，越缺乏内聚性，应该避免

Seneca：
- 使用匹配接口来连接各个服务
- seneca.add为Seneca添加特定模式下被调用的函数
- 在act中的返回结果里，null是错误优先回调

实现控制反转：
```js
seneca.add({ component: 'greeter' }, (msg, res) => {
    res(null, { message: 'Hello' + msg.name })
})

seneca.act({ component: 'greeter', name: 'David' }, (err, data) => {
    if(err) console.error(err);

    console.log(data);
})
```
- 两个组件分别是：生产者（seneca.add）和消费者(seneca.act)
- 控制反转：在act中，没有显示的调用处理业务逻辑的组件，而是通过JSON信息向Seneca指定具体调用的组件
- 只需要一组k-v对，被用于模式匹配引擎Patrun中

模式匹配：
- 是微服务中最灵活的软件模式之一
- 模式容易扩展
- Patrun获取最长匹配项
- 模式中元素的顺序

插件：
- 插件是Seneca的重要组成部分
- 插件在启动时被加载
- 默认的日志级别是INFO
- 插件加载的日志级别是DEBUG
- 默认情况下看不到插件加载信息，获取日志: node xx --seneca.log.all
- 获取插件列表：node xx --seneca.log.all ｜ grep plugin | grep DEFINE

日志内容：
- basic: 主模块中
- transport：传输插件
- web
- mem-store：开箱即用的内存存储功能
- 插件初始化：init函数，在执行action前，必须要保证所有插件都成功初始化

Seneca:
- 默认是TCP进行信息交互
- 微服务之间通信由REST API进行
- 不会对具体的某个应用场景（web）做过多支持， 但可以和其他框架进行整合
- 可以作为Express的中间件
```js
const seneca = require('seneca')();
const web = require('seneca-web');
const adapter = require('seneca-web-adapter-express');
const express = require('express');

const app = express();

seneca.use(web, {
    context: app,
    adapter: adapter,
})

seneca.add('role:api,cmd:fwx', (args, done) => {
    done(null, { bar: 'bazinga' })
})

seneca.act('role:web', {
    routes: {
        prefix: '/test',
        pin: "role:api,cmd:*",
        map: {
            fwx: { GET: true }
        }
    }
})

seneca.ready(() => {
    const appI = seneca.export('web/context')();
    appI.listen(3000)
})


console.log('http://localhost:3000');

```


数据存储：
- Seneca具有数据抽象层，允许使用通用的方式操作应用的数据
- 默认加载in-memory存储插件
- Seneca提供了简单抽象数据层(ORM, 对象关系映射)
    - load: 通过标识读取实体
    - save: 创建实体或者通过标识符更新实体
    - list: 列出满足查询条件的所有实体
    - remove: 删除指定标识符对应的实体
- 默认使用内存数据库，不需要关心表结构
- Seneca中的ORM原语都以$结尾
```js
const Manage = function (options) {

    this.add({ role: 'employee', cmd: 'add' }, (msg, res) => {
        this.make('employee').data$(msg.data).save$(res)
    })

    this.find({ role: 'employee', cmd: 'get' }, (msg, res) => {
        this.make('employee').load$(msg.id, res)
    })
}
```

PM2:
- 为服务器实例带来负载均衡功能的生产级别进程管理器
- 解决Node单线程模型带来的副作用：一个没有被捕获的异常通过杀死线程，进而杀死整个应用
- 单线程模式：如果抛出的异常没有被处理的话，应用程序将会挂掉
- 通过foever可以解决线程死亡，应用仍然继续工作
- 命令:
    - 如果应用挂掉，pm2将会重启
    - pm2 start [xx]
    - 查看详细数据：pm2 show [id]
    - 监控: pm2 monit
    - 查看日志: pm2 logs
    - pm2 reload all
    - pm2 stop all
    - pm2 delete all
    - 使用集群模式：pm2 start [xx] -i 3
    - 更改规模: pm2 scale [xx] 2
- pm2开放了编程接口，可以编写Node管理所有手动过程，可以通过JSON配置
- pm2可以和docker部署node

# 从单块软件到微服务
运行单一容器且开发周期严格定义的大型软件组织是完全违背敏捷开发原则：及早交付和频繁交付
- 没有使用3次以上的场景不适用抽象
- 复制一个服务和配置一个新服务器并将Seneca客户端指向他

微服务的缺陷：
- 人工操作的开销会使微服务带来的好处大打折扣，需要考虑自动化解决
- 应用的不一致性
- 通信复杂性

问题：
活动时，邮件宣传活动激增，会影响日常邮件发送功能。高访问压力下，邮件发送将会出现延迟
在多台机器上部署邮件服务：
```js
const seneca = require('seneca')

seneca.listen({
    port: 1932,
    host: 'new-email-service-ip',
});
```
创建一个指向服务端的Seneca客户端,通过seneca与已有的邮件服务交互
```js
const seneca = require('seneca')()
    .use('microMail')
    .use('smsMicro')
    .use('postMicro')

console.log('http://10.0.0.7:1932');
seneca.listen({ port: 1932, host: '10.0.0.7' })
```
通过senecaEmail与新的邮件服务交互
```js
const senecaEmail = require("seneca").client({
    host: 'new-email-service-ip',
    port: 1932
})
```
当我们调用act时，senecaEmail就能与远端的邮件服务交互了

数据分割的主要问题：
- 面向微服务架构的主要难点是缺乏事务性，必须保证每次独立操作的数据一致性而非最终一致性
- 在使用微服务搭建金融系统的主要原则：涉及到金钱处理的部分不要过于微服务化

高质量软件的设计原则：
- 业务需求切分微服务的单块应用
- ACID（4原则）

# 第一个微服务
- 基于微服务的电子商务软件

内容：
- 编写微服务
- 调整微服务规模
- API
- 整合Seneca，Express
- Seneca持久化数据
- SPA提供API

结构：
1. 商品管理服务
    - 为UI提供数据的Seneca服务端
    - 公司内部创建、更新和删除商品信息的JSON API
2. 订单管理服务
    - 微服务数据本地化
    - 通过其他微服务获取数据
3. 邮件服务
    - 最终一致性
    - 系统降级
4. UI-API

商品管理服务：
- 1是双重核心、系统的核心
设计功能：
- 获取所有商品信息
- 根据分类获取信息列表
- 根据ID获取商品信息
- 添加到数据库-Seneca的数据抽象能力，可以轻易将底层数据库从Mongo切换到其他存储系统
- 删除
- 编辑

```js
/**
 * 获取所有商品列表
 */
const seneca = require('seneca')

seneca.add({area: 'product', action: 'fetch'}, (args, done) => {
    const product = this.make("products");

    product.list$({}, done);
})
```
可以随时替换微服务的存储引擎
```js
/**
 * 获取指定类别的商品列表
 */
seneca.add({area: 'product', action: 'fetch', criteria: 'byCategory'}, (args, done) => {
    const products = this.make("products");

    products.list$({category: args.category}, (err, result) => {
        done(err, result)
    })
})
```
通过id获取数据库数据
```js
/**
 * ID query
 */
seneca.add({area: 'product', action: 'fetch', criteria: 'byId'}, (args, done) => {
    const product = this.make("products")

    product.load$(args.id, (err, result) => {
        done(err, result)
    })
})
```
切换DB时，需要注意：
- 每个微服务的数据都应该存在本地，意味着改变ID的类型，就要改变其他数据库中相关联的ID类型

邮件分发：
- Mandrill
接口定义：
- 渲染是否属于操作的上下文
- 另起一个微服务负责邮件渲染
- 第三方工具管理邮件

# 测试
- chai
    - TDD
- Mocha
    - BDDT
- Sinon.js: mocking框架,测试微服务
- istanbul: 评测测试覆盖率
- 端到端测试: selenium
- request请求包
- 代理调试：http-proxy

微服务文档化：
- Swagger
- 创建项目: swagger project create my-project


# 微服务的监控
- 系统管理的范畴
- 快速响应失败的能力

内容：
- 服务监控
- PM2、Keymetrics
- 监控指标
- Netflix的主动监控
- 吞吐量和性能的降级

服务监控：
- 内存指标
- CPU使用率
- 磁盘使用率
- 单位时间错误数
- 单位时间调用数
- 响应时间

队列技术
- 断路器
- RabbitMQ
- HTTP上使用队列的优势：一旦网络出现丢包，http的消息会被直接丢弃。RabbitMQ可以异步传递消息，一旦消息传递到相应的队列，就会对消息进行持久化

# 微服务的部署
- pm2 部署
- docker和容器的部署
- 持续集成到持续交付应该尽可能的自动化

PM2部署：
- 只需要配置JSON: `pm2 ecosystem`
- env：pm2注入系统的环境变量
- env_<xx>:每一项都是为单个环境定制的
- deploy:配置了dev和prod两套环境

部署微服务：
- RSA密钥：ssh-keygen -t rsa
    -  pm2_rsa
    - pm2_rsa.pub
- cat pm2_rsa.pub | ssh your@your 'cat >> ./ssh/authorized_keys'
- 将私钥注册为已知身份：ssh-add pm2_rsa
- 部署：
    - 完成所有相关配置: pm2 deploy ecosystem.json production setup
    - 完成应用的实际部署: pm2 deploy ecosystem.json production

docker安装必要软件
```dockerfile
FROM centos:latest

RUN curl --silent --location https://rpm.nodesource.com/setup_4.x | bash - && yum install -y nodejs && yum install -y gcc-c++ make

```
- 创建新的镜像: docker commit -a [username] [id] [tagname]

docker容器的创建过程自动化
- 自动化是和微服务打交道的关键
- 自动化最好是Dockerfile

Node应用的集群化
- cluster的库
```js
const cluster = require('cluster')
const http = require('http')
const cpus = require('os').cpus().length

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
    }).listen(80)
}
```

- 管理好集群化，pm2可以简单有效完成集群化: `pm2 start app.js -i 1`
- 在应用进行集群化的时候，对于应用如何规划所用CPU的核数有一个不成文的规定，即该数字应该是总核数减1
- os也需要消耗一些cpu，如果占用了全部，就会减慢应用的处理速度

为应用增加负载均衡
- 集群化不够，需要进行水平扩展
- Nginx实现负载均衡

Nginx的配置:
- 配置文件: `/etc/nginx/nginx.conf`
```conf
upstream app {
    least_conn; // round robin
    server 10.0.0.1:3000;
    server 10.0.0.1:4000;
}
```
- least_conn: 最少连接
- ip_hash: Ip hash值定位去同一台机器
- `sudo /etc/init.d/nginx reload`



