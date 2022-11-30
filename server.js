// Load Environment Variables from the .env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'development'}`, override: true })

process.env.NODE_ENV = process.env.NODE_ENV;
process.env.PORT = process.env.PORT;

const logger = require('./src/services/winston');
console.clear() // Comment this for Continuos logging
logger.info(`App > Server: \x1b[32m\x1b[1m PORT: ${process.env.PORT} \x1b[0m || \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV || '\x1b[31m\x1b[1m NODE_ENV NOT FOUND'} \x1b[0m`)

// App entry point
require('./app').listen(process.env.PORT)