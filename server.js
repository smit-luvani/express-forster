// Load Environment Variables from the .env file
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'development'}`, override: true })

if (!process.env.NODE_ENV || !process.env.PORT) throw new Error('NODE_ENV or PORT not found in .env file. Please configure .env file. See README.md')

const logger = require('./src/services/winston');

// App entry point
require('./app').listen(process.env.PORT).addListener('listening', () => {
    console.clear() // Comment this for Continuos logging
    logger.info(`[Server.js]: \x1b[32m\x1b[1m PORT: ${process.env.PORT} \x1b[0m || \x1b[32m\x1b[1m NODE_ENV: ${process.env.NODE_ENV || '\x1b[31m\x1b[1m NODE_ENV NOT FOUND'} \x1b[0m`)
})