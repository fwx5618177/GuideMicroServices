module.exports = {
  apps : [{
    name: 'main',
    script: './app.js',
    watch: '.'
  }, {
    name: 'users',
    script: './microService/users/server.js',
    watch: ['./microService/users']
  },{
    name: 'roles',
    script: './microService/roles/server.js',
    watch: ['./microService/roles']
  },{
    name: 'articles',
    script: './microService/articles/server.js',
    watch: ['./microService/articles']
  },{
    name: 'data',
    script: './microService/data/server.js',
    watch: ['./microService/data']
  },
],

  deploy : {
    production : {
      user : 'fwx',
      host : '120.78.181.172',
      ref  : 'origin/master',
      repo : 'https://github.com/fwx5618177/GuideMicroServices.git',
      path : '/home/fwx/NodeMicroServicesTest',
      'pre-deploy-local': '',
      'pre-deploy': 'npm -v',
      'post-deploy' : 'cd ./NodeMicroService && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
