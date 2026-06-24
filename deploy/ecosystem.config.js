// PM2 process config
// Usage: pm2 start deploy/ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'cbselect-helpdesk',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/cbselect-helpdesk',  // ← path where you clone the repo on the server
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
