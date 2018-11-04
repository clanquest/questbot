module.exports = {
  apps : [{
    name: 'QuestBot',
    script: './dist/index.js',

    args: 'runBot',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy : {
    production : {
      user : 'node',
      host : 'clanquest.org',
      ref  : 'origin/master',
      repo : 'https://github.com/clanquest/questbot.git',
      path : '/home/node/questbot',
      'post-deploy' : 'npm install && npm run-script build && pm2 reload ecosystem.config.js --env production'
    }
  }
};
