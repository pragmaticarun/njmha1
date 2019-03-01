var environments = {}

environments.staging = {
    'httpPort' : 3000,
    'name' : 'staging'
};

environments.production = {
    'httpPort' : 5000,
    'name' : 'production'
};

var exportedEnv = typeof(process.env.NODE_ENV) == 'string' ? (process.env.NODE_ENV == 'prod' ? environments.production : environments.staging) : environments.staging;

module.exports = exportedEnv;
