const seneca = require('seneca')()
const Express = require('express')
const adapter = require('seneca-web-adapter-express')
const SenecaWeb = require('seneca-web')
const parseBody = require('body-parser')
const Config = require('./config/config')
const Router = Express.Router
const context = new Router()

const senecaWebConfig = {
  context,
  adapter,
  options: { parseBody: false }
}

const app = Express()

app.use(parseBody.json())
app.use(context)
app.listen(3000)

// 微服务
seneca
.use(SenecaWeb, senecaWebConfig)
.use('./plugins/test')
.use('./plugins/ui')
.client(
  {
    type: Config.Protocol,
    pin: `service:${Config.ServiceList.users.name}`,
    port: Config.ServiceList.users.port,
  }
)
.client(
  {
    type: Config.Protocol,
    pin: `service:${Config.ServiceList.roles.name}`,
    port: Config.ServiceList.roles.port,
  }
)
.client(
  {
    type: Config.Protocol,
    pin: `service:${Config.ServiceList.articles.name}`,
    port: Config.ServiceList.articles.port,
  }
)
.client({
  type: Config.Protocol,
  pin: `service:${Config.ServiceList.store.name}`,
  port: Config.ServiceList.store.port,
})