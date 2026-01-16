module.exports = {
  apps: [{
    name: "api-server",
    script: "app/index.js",
    instances: 1,
    watch: true,
    node_args: "-r dotenv/config",
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
};
